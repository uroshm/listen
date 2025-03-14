import React, { useRef, useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { wordsBeginningS, wordsMiddleS, wordsEndS } from '../../utils';
import SlideContent from '../slide-content/SlideContent';
import CircularProgress from '@mui/material/CircularProgress';

interface WordSlide {
  title: string;
  content: string;
  imageUrl: string;
  path: string;
}

const WordList: React.FC = () => {
  const [wordSequence, setWordSequence] = useState<string[]>([]);
  const [slides, setSlides] = useState<WordSlide[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [analysisResult] = useState<string>('');

  const { getToken } = useAuth();

  const audioChunksRef = useRef<Blob[]>([]); // Use a ref to store audio chunks
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startAudio = async (
    audioContext: AudioContext,
    analyser: AnalyserNode
  ) => {
    generateWordSequence();
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

          const formData = new FormData();
          formData.append('file', audioBlob, 'recording.wav');
          formData.append('expected_text', wordSequence.join(' ') || '');

          try {
            const audioResponse = await fetch(
              'http://localhost:8000/api/speech/analyze/',
              {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${getToken()}`,
                },
                body: formData,
              }
            );

            if (!audioResponse.ok) {
              throw new Error('Failed to upload audio');
            }

            const audioAnalysis = await audioResponse.text();
            const parsedAudioAnalysis = JSON.parse(audioAnalysis);
            console.log('Audio analysis:', parsedAudioAnalysis);

            // const apiKey = import.meta.env.VITE_LISTEN_OPENAI_API_KEY;
            // const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            //   method: "POST",
            //   headers: {
            //     "Authorization": "Bearer " + apiKey,
            //     "Content-Type": "application/json"
            //   },
            //    body: JSON.stringify({
            //      "model": "deepseek/deepseek-r1-zero:free",
            //      "messages": [
            //        {
            //          "role": "user",
            //          "content": `Analyze this speech result, and give a speech language pathology analysis:
            //            Transcription: ${parsedAudioAnalysis.transcription}
            //            Expected Text: ${parsedAudioAnalysis.expected_text}
            //            Phonemes: ${parsedAudioAnalysis.phonemes.join(', ')}`
            //        }
            //      ]
            //    })
            // });

            // if (!aiResponse.ok) {
            //   throw new Error('Failed to get AI analysis');
            // }

            // const analysisData = await aiResponse.json();
            // const analysis = analysisData.choices[0].message.content;
            // console.log('Raw AI response:', analysis);

            // try {
            //   // Remove the \boxed{} wrapper
            //   const cleanedAnalysis = analysis.replace(/\\boxed{(.*?)}/s, '$1');

            //   // Format the analysis with sections
            //   const formattedAnalysis = `
            //     Speech Analysis Results
            //     ----------------------
            //     ${cleanedAnalysis}
            //   `.trim();

            //   setAnalysisResult(formattedAnalysis);
            // } catch (error) {
            //   console.error('Error formatting AI analysis:', error);
            //   // Fallback to displaying the raw content
            //   setAnalysisResult(analysis);
            // }
          } catch (error) {
            console.error('Error processing audio:', error);
          }
        } else {
          console.error('Audio blob is empty');
        }
        audioChunksRef.current = []; // Clear the ref after processing
      };
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const generateWordSequence = () => {
    const allWords = [...wordsBeginningS, ...wordsMiddleS, ...wordsEndS];
    const shuffled = [...allWords].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 10);
    setWordSequence(selected);
    // Preload images and create slides
    const preloadImages = selected.map((word) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          resolve({
            title: word,
            content: '',
            imageUrl: `/s_sounds/${word.toLowerCase()}.jpeg`,
            path: '#',
          });
        };
        img.onerror = () => resolve(null);
        img.src = `/s_sounds/${word.toLowerCase()}.jpeg`;
      });
    });

    // Update state once images are loaded
    Promise.all(preloadImages).then((loadedSlides) => {
      const validSlides = loadedSlides.filter(Boolean) as WordSlide[];
      setSlides(validSlides);
      setWordSequence(selected);
    });
  };

  useEffect(() => {
    generateWordSequence(); // Generate words immediately on mount

    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;

    startAudio(audioContext, analyser);

    return () => {
      audioContext.close();
      if (timerRef.current) {
        clearInterval(timerRef.current as NodeJS.Timeout);
      }
    };
  }, []);

  const handleRecord = () => {
    if (mediaRecorder) {
      if (isRecording) {
        mediaRecorder.stop();
        setIsRecording(false);
        setIsAnalyzing(true);
        if (timerRef.current) {
          clearInterval(timerRef.current as NodeJS.Timeout);
          setTimeLeft(null);
        }
      } else {
        mediaRecorder.start();
        setIsRecording(true);
        setTimeLeft(40);

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

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {!isAnalyzing && (
        <h3>
          Click the "Start Recording" button, and say whatever word you see on
          the screen!
        </h3>
      )}

      {slides.length > 0 && !isAnalyzing && (
        <div style={{ margin: '2rem auto', maxWidth: '800px' }}>
          <SlideContent slides={slides} />
        </div>
      )}

      {!isAnalyzing && (
        <button
          onClick={handleRecord}
          style={{
            display: 'block',
            margin: '20px auto',
            backgroundColor: isRecording ? '#ff4444' : '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {isRecording ? `Stop Recording (${timeLeft}s)` : 'Start Recording'}
        </button>
      )}

      {isAnalyzing && !analysisResult && (
        <div
          style={{
            margin: '40px auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <CircularProgress
            size={60}
            thickness={4}
            sx={{
              color: '#4CAF50',
            }}
          />
          <div
            style={{
              color: '#666',
              fontSize: '1.1rem',
              fontWeight: 500,
            }}
          >
            Analyzing your recording...
          </div>
        </div>
      )}

      {recordedAudio && (
        <>
          <audio
            controls
            src={recordedAudio}
            style={{ display: 'block', margin: '20px auto' }}
          />
          {analysisResult && (
            <div
              style={{
                margin: '20px auto',
                padding: '20px',
                backgroundColor: '#f5f5f5',
                borderRadius: '5px',
                maxWidth: '600px',
              }}
            >
              <h3>Analysis:</h3>
              <p>{analysisResult}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WordList;
