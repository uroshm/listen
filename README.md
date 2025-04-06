# Listen

Listen is a multi-purpose tool designed specifically for speech-language pathologists (SLPs). It provides an all-in-one solution for SLPs to enhance their work with clients through advanced features such as real-time speech recognition and testing, AI integration, record keeping, goal setting, goal tracking, and more.

## Docker
The project includes Docker support for running the backend, frontend, and database in containers.

### Running with Docker
First, build the back-end. Navigate to the backend directory and run `./gradlew clean build`.
Next, build the front-end. Navigate to the frontend directory and run `npm run clean && npm run build`.

Now, to run the entire application using Docker, use the following command:
```sh
docker-compose up
```
