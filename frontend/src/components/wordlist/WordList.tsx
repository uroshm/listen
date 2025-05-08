import React, { useRef, useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { wordsBeginningS, wordsMiddleS, wordsEndS } from '../../utils';
import SlideContent from '../slide-content/SlideContent';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import PersonIcon from '@mui/icons-material/Person';
import ScienceIcon from '@mui/icons-material/Science';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { PatientInfo } from '../../utils';
import './WordList.css';
import { useNavigate } from 'react-router-dom';

interface WordSlide {
  title: string;
  content: string;
  imageUrl: string;
  path: string;
}

interface WordListProps {
  open: boolean;
  onClose: (testResult?: {
    testCompleted: boolean;
    patientId: number | null;
    testConfig: { testName: string; speechSound: string } | null;
  }) => void;
  patient: PatientInfo | null;
  testConfig: { testName: string; speechSound: string } | null;
}

const WordList: React.FC<WordListProps> = ({
  open,
  onClose,
  patient,
  testConfig,
}) => {
  const [slides, setSlides] = useState<WordSlide[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string>('');

  const { getToken } = useAuth();

  const audioChunksRef = useRef<Blob[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wordSequenceRef = useRef<string[]>([]);

  // Reset state when modal is opened
  useEffect(() => {
    if (open) {
      setIsRecording(false);
      setRecordedAudio(null);
      setAnalysisResult('');
      setIsAnalyzing(false);
      setTimeLeft(null);
      audioChunksRef.current = [];

      // Initialize audio and generate word sequence
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;

      startAudio(audioContext, analyser);
      generateWordSequence();

      return () => {
        audioContext.close();
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [open]);

  const startAudio = async (
    audioContext: AudioContext,
    analyser: AnalyserNode
  ) => {
    if (!getToken()) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm',
        });
        if (audioBlob.size > 0) {
          const audioUrl = URL.createObjectURL(audioBlob);
          setRecordedAudio(audioUrl);

          // Use the ref instead of the state
          const expectedWords = wordSequenceRef.current.join(' ');

          const payloadAnalyzeSpeech = new FormData();
          payloadAnalyzeSpeech.append('file', audioBlob, 'recording.wav');
          payloadAnalyzeSpeech.append('expectedText', expectedWords);

          try {
            const audioResponse = await fetch(
              'http://0.0.0.0:8000/api/speech/analyze/',
              {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${getToken()}`,
                },
                body: payloadAnalyzeSpeech,
              }
            );
            console.log('Audio response:', JSON.stringify(audioResponse));

            if (!audioResponse.ok) {
              throw new Error('Failed to upload audio');
            }

            const audioAnalysis = await audioResponse.json();
            const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
            const aiResponse = await fetch(
              'https://openrouter.ai/api/v1/chat/completions',
              {
                method: 'POST',
                headers: {
                  Authorization: 'Bearer ' + apiKey,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  model: 'deepseek/deepseek-chat-v3-0324:free',
                  messages: [
                    {
                      role: 'user',
                      content: `
                        Write a brief analysis on the results as well.
                        Here is a list of words I asked my patient to pronounce.
                        Focusing only on the ${testConfig?.speechSound} sound, 
                        have data regarding % accurate vs inaccurate production in table format, including words in each column.
                        Expected Text: ${audioAnalysis.expected_text}
                        Actual Recorded Phonemes: ${audioAnalysis.phonemes ? audioAnalysis.phonemes.join(', ') : 'No phonemes detected'}`,
                    },
                  ],
                }),
              }
            );

            if (!aiResponse.ok) {
              throw new Error('Failed to get AI analysis');
            }

            const analysisData = await aiResponse.json();
            setAnalysisResult(analysisData.choices[0].message.content);

            const payloadCreateTest = new FormData();
            payloadCreateTest.append('file', audioBlob, 'recording.wav');
            payloadCreateTest.append(
              'testName',
              testConfig?.testName || 'Word List'
            );
            payloadCreateTest.append(
              'testDetails',
              `Pronounciation of ${testConfig?.speechSound || '/s/'} sound`
            );
            payloadCreateTest.append('testDate', new Date().toISOString());
            payloadCreateTest.append('testData', JSON.stringify(audioAnalysis));
            payloadCreateTest.append(
              'testAnalysis',
              analysisData.choices[0].message.content
            );
            payloadCreateTest.append('patientId', patient?.id || '');

            try {
              const createTestResponse = await fetch(
                'http://localhost:8080/listen/records/createTest',
                {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${getToken()}`,
                  },
                  body: payloadCreateTest,
                }
              );

              if (!createTestResponse.ok) {
                throw new Error('Failed to save test results');
              }
            } catch (error) {
              console.error('Failed to save test results:', error);
            }
          } catch (error) {
            console.error('Failed to analyze audio:', error);
          }
        } else {
          console.error('Audio blob is empty');
        }
        audioChunksRef.current = []; // Clear the ref after processing
        setIsAnalyzing(false);
        handleModalClose();
      };
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const generateWordSequence = () => {
    const sound = testConfig?.speechSound || 's';
    const position = testConfig?.testName || 'initial';
    let wordPool: string[] = [];

    switch (sound) {
      case 's':
        if (position === 'initial') {
          wordPool = [...wordsBeginningS];
        } else if (position === 'medial') {
          wordPool = [...wordsMiddleS];
        } else if (position === 'final') {
          wordPool = [...wordsEndS];
        }
        break;

      case 'r':
        if (position === 'initial') {
          wordPool = [...wordsBeginningS];
        } else if (position === 'medial') {
          wordPool = [...wordsMiddleS];
        } else if (position === 'final') {
          wordPool = [...wordsEndS];
        }
        break;

      case 'l':
        if (position === 'initial') {
          wordPool = [...wordsBeginningS];
        } else if (position === 'medial') {
          wordPool = [...wordsMiddleS];
        } else if (position === 'final') {
          wordPool = [...wordsEndS];
        }
        break;

      case 'th':
        if (position === 'initial') {
          wordPool = [...wordsBeginningS];
        } else if (position === 'medial') {
          wordPool = [...wordsMiddleS];
        } else if (position === 'final') {
          wordPool = [...wordsEndS];
        }
        break;
    }

    // Shuffle and select 10 words
    const shuffled = [...wordPool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 5);

    wordSequenceRef.current = selected;

    const preloadImages = selected.map((word) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          resolve({
            title: word,
            content: '',
            imageUrl: `${word.toLowerCase()}.jpeg`,
            path: '#',
          });
        };
        img.onerror = () => {
          resolve({
            title: word,
            content: word,
            imageUrl: '',
            path: '#',
          });
        };
        img.src = `${word.toLowerCase()}.jpeg`;
      });
    });

    Promise.all(preloadImages).then((loadedSlides) => {
      const validSlides = loadedSlides.filter(Boolean) as WordSlide[];
      setSlides(validSlides);
    });
  };

  const handleRecord = () => {
    if (mediaRecorder) {
      if (isRecording) {
        mediaRecorder.stop();
        setIsRecording(false);
        setIsAnalyzing(true);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          setTimeLeft(null);
        }
      } else {
        mediaRecorder.start();
        setIsRecording(true);
        setTimeLeft(9);

        timerRef.current = setInterval(() => {
          setTimeLeft((prevTime) => {
            if (prevTime === 1) {
              mediaRecorder.stop();
              setIsRecording(false);
              setIsAnalyzing(true);
              clearInterval(timerRef.current as NodeJS.Timeout);
              return null;
            }
            return prevTime ? prevTime - 1 : null;
          });
        }, 1000);
      }
    }
  };

  const handleNewTest = () => {
    setIsRecording(false);
    setRecordedAudio(null);
    setAnalysisResult('');
    setIsAnalyzing(false);
    generateWordSequence();
  };

  const handleModalClose = () => {
    onClose();
  };
  const navigate = useNavigate();
  const handleViewTests = (patient: PatientInfo) => {
    navigate('/tests', {
      state: {
        patient: patient,
      },
    });
  };

  return (
    <Dialog
      open={open}
      onClose={isRecording ? undefined : handleModalClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { minHeight: '80vh', maxHeight: '90vh' },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Typography variant="h5">Speech Sound Test</Typography>
        {!isRecording && (
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleModalClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent className="modal-content">
        <Paper
          elevation={2}
          sx={{
            p: 2,
            mb: 3,
            mt: 2,
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
          }}
        >
          <Box className="patient-info-section">
            <PersonIcon color="primary" />
            <Typography variant="subtitle1" component="span">
              Patient:
            </Typography>
            <Chip
              label={`${patient?.firstName} ${patient?.lastName}`}
              color="primary"
              variant="outlined"
            />
          </Box>

          <Box className="patient-info-section">
            <ScienceIcon color="secondary" />
            <Typography variant="subtitle1" component="span">
              Test:
            </Typography>
            <Chip
              label={`${testConfig?.testName || 'Word List'}`}
              color="secondary"
              variant="outlined"
            />
            <Chip
              label={`Sound: ${testConfig?.speechSound || '/s/'}`}
              color="secondary"
              variant="outlined"
            />
          </Box>

          {isAnalyzing && (
            <Tooltip title="View Tests">
              <IconButton
                onClick={() => handleViewTests(patient!)}
                className={patient?.id ? 'highlight-action' : ''}
              >
                <AssessmentIcon />
              </IconButton>
            </Tooltip>
          )}
        </Paper>

        {!isAnalyzing && !isRecording && !recordedAudio && (
          <Typography variant="h6" className="word-list-header">
            Click the "Start Recording" button, and say whatever word you see on
            the screen!
          </Typography>
        )}

        {slides.length > 0 && !isAnalyzing && !recordedAudio && (
          <div className="slides-container">
            <SlideContent slides={slides} autoScroll={isRecording} />
          </div>
        )}
        <Box sx={{ textAlign: 'center' }}>
          {!isAnalyzing && !recordedAudio && (
            <Button
              variant="contained"
              onClick={handleRecord}
              className={`recording-button ${isRecording ? 'recording' : 'not-recording'}`}
            >
              {isRecording
                ? `Stop Recording (${timeLeft}s)`
                : 'Start Recording'}
            </Button>
          )}
        </Box>
        {isAnalyzing && !analysisResult && (
          <div className="analyzing-container">
            <CircularProgress
              size={60}
              thickness={4}
              sx={{
                color: '#4CAF50',
              }}
            />
            <div className="analyzing-text">
              Analyzing your recording... Wait here or click "View Tests" in the
              top right to see results.
            </div>
          </div>
        )}

        {recordedAudio && (
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <audio controls src={recordedAudio} className="audio-player" />
            </Box>
            {analysisResult && (
              <Paper elevation={1} className="analysis-container">
                <Typography variant="h6" gutterBottom>
                  Analysis:
                </Typography>
                <div className="markdown-content">
                  <ReactMarkdown
                    rehypePlugins={[rehypeRaw]}
                    remarkPlugins={[remarkGfm]}
                  >
                    {analysisResult}
                  </ReactMarkdown>
                </div>
              </Paper>
            )}
          </Box>
        )}
      </DialogContent>

      {recordedAudio && analysisResult && (
        <DialogActions className="modal-footer">
          <Button onClick={handleNewTest} variant="outlined" color="primary">
            Start New Test
          </Button>
          <Button
            onClick={handleModalClose}
            variant="contained"
            color="primary"
            disabled={isRecording || isAnalyzing}
          >
            Close
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default WordList;
