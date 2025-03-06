import React, { useRef, useEffect, useState } from 'react';
import { sentencesByFile, SentenceByFile } from '../../assets/utils';

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
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);

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

    const startAudio = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      recorder.ondataavailable = (event) => {
        setAudioChunks((prev) => [...prev, event.data]);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
        setAudioChunks([]);
      };
    };

    startAudio();
    draw();

    return () => {
      audioContext.close();
      audioContext.close();
    };
  }, [width, height, audioChunks]);

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

  return (
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
        <audio
          controls
          src={recordedAudio}
          style={{ display: 'block', margin: '20px auto' }}
        />
      )}
    </div>
  );
};

export default Record;
