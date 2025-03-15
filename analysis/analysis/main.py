from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .controller import api_router

# Create FastAPI app
app = FastAPI(
    title="Speech Analysis API",
    description="API for analyzing speech audio files",
    version="0.1.0",
)

# Configure CORS - allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Changed to allow all origins for development
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept", "Origin"],
    expose_headers=["Access-Control-Allow-Origin"],
)

# Add middleware to explicitly set Access-Control-Allow-Origin header
@app.middleware("http")
async def add_cors_header(request: Request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"  # Or specific origin
    return response

# Include the router
app.include_router(api_router)

# Root endpoint
@app.get("/")
def root():
    return {"message": "Speech Analysis API is running", "docs": "/docs"}

# Add explicit OPTIONS handler for the analyze endpoint
@app.options("/api/speech/analyze")
async def options_analyze():
    response = JSONResponse(content={"detail": "OK"})
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, Accept, Origin"
    return response
