# Listen

Listen is a multi-purpose tool designed specifically for speech-language pathologists (SLPs). It provides an all-in-one solution for SLPs to enhance their work with clients through advanced features such as real-time speech recognition and testing, AI integration, record keeping, goal setting, goal tracking, and more.



## Backend

The backend is built with Spring Boot and includes the following features:

- User authentication and authorization using JWT.
- RESTful API for managing widgets.
- Integration with PostgreSQL database.

### Running the Backend

To run the backend, use the following commands:

```sh
cd backend
./gradlew bootRun
```
### Converting .wav files

If you find that your .wav file is not being transcribed properly, it could because the sample rate isn't compatible with Sphinx. You can convert the file to a sample rate of 16kHz and 16-bit PCM encoded using the following command:

```sh
ffmpeg -i <filename.wav> -ac 1 -ar 16000 -sample_fmt s16 <filename_converted.wav>
```

## Frontend

The frontend is built with React and TypeScript and includes the following features:

- User authentication using JWT.
- Components for managing and displaying widgets.
- Integration with the backend API.

### Running the Frontend
To run the frontend, use the following commands:
```sh
cd frontend
npm run dev
```

## Database
The database is managed using PostgreSQL and includes the following features:

### Schema and table creation for widgets.
Initialization script for setting up the database.

## Docker
The project includes Docker support for running the backend, frontend, and database in containers.

### Running with Docker
To run the entire application using Docker, use the following command:
```sh
docker-compose up
```
