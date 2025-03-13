from fastapi import FastAPI
from .controller import api_router

# Create FastAPI app
app = FastAPI(
    title="Speech Analysis API",
    description="API for analyzing speech audio files",
    version="0.1.0",
)

# Include the router
app.include_router(api_router)


# Root endpoint
@app.get("/")
def root():
    return {"message": "Speech Analysis API is running", "docs": "/docs"}
