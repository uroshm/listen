
FROM python:3.9-slim
WORKDIR /app

COPY ./analysis /app/analysis
COPY ./pyproject.toml /app/

RUN pip install -e .

RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

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


# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "analysis.main:app", "--host", "0.0.0.0", "--port", "8000"]