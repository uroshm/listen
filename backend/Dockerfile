FROM openjdk:21-jdk-slim

WORKDIR /app
RUN apt-get update && apt-get install -y ffmpeg
COPY build/libs/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"] 