import { useNavigate } from 'react-router-dom';
import './Widgets.css';

const Record = () => {
  const navigate = useNavigate();
  let audioProcessor = null;

  const startRecording = async () => {
    audioProcessor = new AudioProcessor();
    await audioProcessor.init();
  };

  return (
    <section className="mainContent">
      <div className="services">
        <h2>What We Offer</h2>
        <div className="serviceGrid">
          <div className="serviceItem">
            <button onClick={() => navigate('/buy-widgets')}>
              <h3>Buy Widgets</h3>
              <p>
                Buy our widgets at the best prices. We offer a wide range of
                widgets to suit your needs
              </p>
            </button>
          </div>
          <div className="serviceItem">
            <button onClick={startRecording}>
              <h3>Record Speech</h3>
              <p>Click to start recording and create a spectrogram.</p>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

class AudioProcessor {
  audioContext: AudioContext;
  analyser: AnalyserNode;
  microphone: MediaStreamAudioSourceNode | null;

  constructor() {
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.microphone = null;
  }

  async init() {
    // Request microphone access
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.microphone = this.audioContext.createMediaStreamSource(stream);

    // Connect the microphone to the analyser
    this.microphone.connect(this.analyser);
    this.analyser.fftSize = 2048;

    // Start processing audio
    this.processAudio();
  }

  processAudio() {
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    const update = () => {
      this.analyser.getByteFrequencyData(dataArray);
      // Process the audio data here (e.g., visualize, analyze, etc.)
      requestAnimationFrame(update);
    };

    update();
  }
}

export default Record;
