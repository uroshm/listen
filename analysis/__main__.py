import os
import sys
import uvicorn

# Add the parent directory to Python path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

if __name__ == "__main__":
    uvicorn.run("analysis.main:app", host="0.0.0.0", port=8000, reload=True)