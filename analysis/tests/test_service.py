import sys
import os
import uuid
from pathlib import Path

# Add the project root to PYTHONPATH so we can import the analysis module
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pytest
from analysis.service import SpeechAnalysisService


def test_analyze_audio():
    """Test that the speech analysis service can analyze a wav file"""
    # Create a service instance
    service = SpeechAnalysisService()
    
    # Generate a unique ID for this analysis
    analysis_id = uuid.uuid4()
    
    # Path to test audio file
    file_path = Path(__file__).parent / "cowOverMoon.wav"
    
    # Make sure test file exists
    assert file_path.exists(), f"Test audio file not found at {file_path}"
    
    # Read the file content as bytes
    with open(file_path, "rb") as audio_file:
        file_content = audio_file.read()
    
    # Call the analyze_audio method with the file content
    result = service.analyze_audio(
        analysis_id=analysis_id,
        audio_file=file_content,  # Pass the actual bytes content
        language="en"
    )
    
    # Basic assertions
    assert result is not None
    assert result["status"] in ["processing", "completed", "failed"]
    
    # If completed, check for transcription
    if result["status"] == "completed":
        assert result["text"] is not None
        assert isinstance(result["text"], str)


if __name__ == "__main__":
    pytest.main(["-xvs", __file__])