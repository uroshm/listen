import os
import logging
from typing import Dict, Any, Union, BinaryIO
from uuid import UUID
import tempfile
from datetime import datetime
import os
import librosa
import torch
from transformers import AutoProcessor, AutoModelForCTC
import nltk
from .data_class import SpeechAnalysisResult

logger = logging.getLogger(__name__)


class SpeechAnalysisService:
    def __init__(self):
        self._analyses = {}
        self._temp_dir = tempfile.mkdtemp()
        logger.info(
            f"Speech analysis service initialized with temp dir: {self._temp_dir}"
        )

    def analyze_audio(
        self,
        analysis_id: UUID,
        audio_file: Union[str, bytes, BinaryIO],
        language: str = "en",
        settings: Dict[str, Any] = None,
    ) -> SpeechAnalysisResult:
        try:
            self._analyses[analysis_id] = {
                "analysis_id": analysis_id,
                "status": "processing",
                "created_at": datetime.now().isoformat(),
                "language": language,
                "settings": settings,
                "text": None,
                "phonemes": [],
                "phoneme_criteria": [],
                "error": None,
            }

            temp_file = None

            processor = AutoProcessor.from_pretrained("facebook/wav2vec2-base-960h")
            model = AutoModelForCTC.from_pretrained("facebook/wav2vec2-base-960h")

            temp_file = os.path.join(self._temp_dir, f"{analysis_id}.wav")
            with open(temp_file, "wb") as f:
                f.write(audio_file)

            audio_path = temp_file

            try:
                audio, sr = librosa.load(audio_path, sr=None)
            except Exception as e:
                print(f"Direct loading failed: {e}, attempting conversion...")
                converted_path = convert_audio_format(audio_path)
                if not converted_path:
                    raise Exception("Audio conversion failed")
                audio, sr = librosa.load(converted_path, sr=None)

            if sr != 16000:
                audio = librosa.resample(audio, orig_sr=sr, target_sr=16000)
            if audio.ndim > 1:
                audio = librosa.to_mono(audio)

            input_values = processor(
                audio, return_tensors="pt", sampling_rate=16000
            ).input_values
            with torch.no_grad():
                logits = model(input_values).logits

            predicted_ids = torch.argmax(logits, dim=-1)
            transcription = processor.decode(predicted_ids[0])
            print("Transcription:", transcription)

            try:
                nltk.data.find("corpora/cmudict")
            except LookupError:
                nltk.download("cmudict")
            from nltk.corpus import cmudict

            prondict = cmudict.dict()

            def get_phonemes(word):
                word = word.lower()
                if word in prondict:
                    return prondict[word][0]
                else:
                    return []

            words = transcription.lower().split()
            phonemes = []
            word_to_phonemes = {}

            for word in words:
                word = "".join(
                    c for c in word if c.isalpha()
                )  # Remove non-alphabetic characters
                if word:  # Skip empty strings
                    word_phonemes = get_phonemes(word)
                    if word_phonemes:
                        phonemes.extend(word_phonemes)

            print("Phonemes:", phonemes)
            print("\nWord to Phonemes mapping:")
            for word, phones in word_to_phonemes.items():
                print(f"{word}: {' '.join(phones)}")

            result = SpeechAnalysisResult(
                analysis_id=analysis_id,
                created_at=datetime.now(),
                status="completed",
                transcription=transcription,
                phonemes=phonemes,
                error=None,
            )

            if 'converted_path' in locals() and os.path.exists(converted_path):
                os.remove(converted_path)

            return result

        except Exception as e:
            logger.exception(f"Error analyzing audio: {e}")
            return SpeechAnalysisResult(
                analysis_id=analysis_id,
                created_at=datetime.now(),
                status="failed",
                transcription="",
                confidence=0.0,
                phonemes=[],
                error=str(e),
            )

    def cleanup(self):
        if os.path.exists(self._temp_dir):
            import shutil

            shutil.rmtree(self._temp_dir)
            logger.info(f"Cleaned up temp directory: {self._temp_dir}")
