# Stage 1: Build the application
FROM gradle:7.3.3-jdk17 AS build

# Set working directory
WORKDIR /app

# Copy the Gradle wrapper and build files
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# Copy the source code
COPY src src

# Clean and build the application
RUN ./gradlew clean build

# Stage 2: Create the final image
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["java", "-jar", "app.jar"]