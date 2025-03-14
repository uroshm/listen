import React, { useRef, useEffect, useState } from 'react';
import { sentencesByFile, SentenceByFile } from '../../utils';
import { useAuth } from '../../auth/AuthContext';

interface SpectrogramProps {
  width?: number;
  height?: number;
}

const Record: React.FC<SpectrogramProps> = ({ width = 800, height = 400 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [randomSentence, setRandomSentence] = useState<SentenceByFile>();
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const { getToken } = useAuth();

  const audioChunksRef = useRef<Blob[]>([]); // Use a ref to store audio chunks

  const startAudio = async (
    audioContext: AudioContext,
    analyser: AnalyserNode
  ) => {
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
          formData.append('expected_text', randomSentence?.value || '');

          try {
            const audioResponse = await fetch(
              'http://127.0.0.1:8000/api/speech/analyze/',
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
            const apiKey = import.meta.env.VITE_LISTEN_OPENAI_API_KEY;

            const aiResponse = await fetch(
              'https://openrouter.ai/api/v1/chat/completions',
              {
                method: 'POST',
                headers: {
                  Authorization: 'Bearer ' + apiKey,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  model: 'deepseek/deepseek-r1-zero:free',
                  messages: [
                    {
                      role: 'user',
                      content: `Analyze this speech result, and give a speech language pathology analysis:
                       Transcription: ${parsedAudioAnalysis.transcription}
                       Expected Text: ${parsedAudioAnalysis.expected_text}
                       Phonemes: ${parsedAudioAnalysis.phonemes.join(', ')}`,
                    },
                  ],
                }),
                //body: JSON.stringify({
                //  "model": "deepseek/deepseek-r1-zero:free",
                //  "messages": [
                //    {
                //      "role": "user",
                //      "content": `What TV show is this from? Transcription: ${parsedAudioAnalysis.transcription}`
                //    }
                //  ]
                //})
              }
            );

            if (!aiResponse.ok) {
              throw new Error('Failed to get AI analysis');
            }

            const analysisData = await aiResponse.json();
            const analysis = analysisData.choices[0].message.content;
            console.log('Raw AI response:', analysis);

            try {
              // Remove the \boxed{} wrapper
              const cleanedAnalysis = analysis.replace(/\\boxed{(.*?)}/s, '$1');

              // Format the analysis with sections
              const formattedAnalysis = `
                Speech Analysis Results
                ----------------------
                ${cleanedAnalysis}
              `.trim();

              setAnalysisResult(formattedAnalysis);
            } catch (error) {
              console.error('Error formatting AI analysis:', error);
              // Fallback to displaying the raw content
              setAnalysisResult(analysis);
            }
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

  useEffect(() => {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;

    startAudio(audioContext, analyser);

    return () => {
      audioContext.close(); // Clean up
    };
  }, []);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * sentencesByFile.length);
    setRandomSentence(sentencesByFile[randomIndex]);

    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgb(255, 255, 255)';
      ctx.fillRect(0, 0, width, height);

      const barWidth = (width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
        ctx.fillRect(x, height - barHeight / 2, barWidth, barHeight / 2);

        x += barWidth + 1;
      }
    };

    startAudio(audioContext, analyser);
    draw();

    return () => {
      audioContext.close();
    };
  }, [width, height]);

  const handleRecord = () => {
    if (mediaRecorder) {
      if (isRecording) {
        mediaRecorder.stop();
      } else {
        mediaRecorder.start();
      }
      setIsRecording(!isRecording);
    }
  };

  return getToken() ? (
    <div>
      <canvas ref={canvasRef} width={width} height={height}></canvas>
      <div
        style={{
          fontSize: '2em',
          color: 'black',
          textAlign: 'center',
          marginTop: '20px',
        }}
      >
        {randomSentence?.value}
      </div>
      <button
        onClick={handleRecord}
        style={{ display: 'block', margin: '20px auto' }}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
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
  ) : (
    <p>Not logged in!</p>
  );
};

export default Record;
