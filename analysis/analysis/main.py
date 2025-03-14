from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .controller import api_router

# Create FastAPI app
app = FastAPI(
    title="Speech Analysis API",
    description="API for analyzing speech audio files",
    version="0.1.0",
)

# Configure CORS
origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
)

# Include the router
app.include_router(api_router)

# Root endpoint
@app.get("/")
def root():
    return {"message": "Speech Analysis API is running", "docs": "/docs"}
