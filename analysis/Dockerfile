# Use Python 3.9 Alpine for a smaller base image
FROM python:3.9-slim AS builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy only pyproject.toml first to leverage Docker cache
COPY pyproject.toml /tmp/
WORKDIR /tmp

# Install dependencies
RUN pip install --no-cache-dir --upgrade pip setuptools wheel && \
    pip install -e .

# Final stage
FROM python:3.9-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

# Copy installed packages from builder
COPY --from=builder /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

WORKDIR /app

# Create utility directory structure first
RUN mkdir -p /app/analysis/utils


RUN echo "def convert_audio_format(input_file, output_file='converted.wav'):\n\
    import subprocess\n\
    import os\n\
    try:\n\
        output_dir = os.path.dirname(output_file)\n\
        if output_dir and not os.path.exists(output_dir):\n\
            os.makedirs(output_dir)\n\
        subprocess.run([\"ffmpeg\", \"-i\", input_file, \"-ar\", \"16000\", \"-ac\", \"1\", \"-sample_fmt\", \"s16\", output_file], check=True)\n\
        return output_file\n\
    except Exception as e:\n\
        print(f\"Error converting audio: {e}\")\n\
        return None\n" > /app/analysis/utils/audio_converter.py


# Create __init__.py files
RUN touch /app/analysis/__init__.py /app/analysis/utils/__init__.py

# Download NLTK data to a specific location
RUN mkdir -p /app/nltk_data && \
    python -c "import nltk; nltk.data.path.append('/app/nltk_data'); nltk.download('cmudict', download_dir='/app/nltk_data')"
ENV NLTK_DATA=/app/nltk_data

# Copy only the necessary application files
COPY ./analysis /app/analysis
COPY ./pyproject.toml /app/

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "analysis.main:app", "--host", "0.0.0.0", "--port", "8000"]