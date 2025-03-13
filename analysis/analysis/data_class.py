from dataclasses import dataclass
from typing import List, Dict, Optional, Any
from uuid import UUID
from datetime import datetime


@dataclass
class PhonemeMatch:
    word: str
    expected: List[str]
    actual: List[str]
    is_match: bool


@dataclass
class SpeechAnalysisResult:
    analysis_id: UUID
    created_at: datetime
    status: str
    transcription: str
    phonemes: List[str]
    # expected_phonemes: List[str]
    error: Optional[str] = None
