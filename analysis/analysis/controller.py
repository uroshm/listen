from fastapi import (
    APIRouter,
    HTTPException,
    UploadFile,
    File,
    Depends,
    BackgroundTasks,
    Form,
)
from fastapi.responses import JSONResponse
from typing import Dict, Optional
from uuid import uuid4
from .service import SpeechAnalysisService
from .data_class import PhonemeMatch, SpeechAnalysisResult

# Create API router
api_router = APIRouter(prefix="/api/speech", tags=["speech"])


def get_speech_service():
    return SpeechAnalysisService()


@api_router.post("/analyze")
async def analyze_speech(
    file: UploadFile = File(...),
    language: str = "en",
    expected_text: Optional[str] = Form(None),
    service: SpeechAnalysisService = Depends(get_speech_service),
) -> Dict:
    analysis_id = uuid4()
    file_content = await file.read()
    result = service.analyze_audio(analysis_id, file_content, language, expected_text)
    # Convert dataclass to dict for JSON response
    return {
        "analysis_id": result.analysis_id,
        "created_at": result.created_at.isoformat(),
        "status": result.status,
        "transcription": result.transcription,
        "expected_text": expected_text,
        "phonemes": result.phonemes,
        "error": result.error,
    }
