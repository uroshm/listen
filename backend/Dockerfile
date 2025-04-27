# Build stage with Gradle
FROM eclipse-temurin:17-jdk AS builder

# Install Gradle
ENV GRADLE_VERSION=8.5
RUN apt-get update && apt-get install -y --no-install-recommends wget unzip \
    && wget -q https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip \
    && unzip gradle-${GRADLE_VERSION}-bin.zip -d /opt \
    && rm gradle-${GRADLE_VERSION}-bin.zip \
    && ln -s /opt/gradle-${GRADLE_VERSION}/bin/gradle /usr/bin/gradle

# Set working directory
WORKDIR /app

# Copy Gradle configuration files
COPY build.gradle settings.gradle gradlew ./
COPY gradle ./gradle

# Copy source code
COPY src ./src

# Clean and build the project
RUN gradle clean build --no-daemon

# Runtime stage
FROM eclipse-temurin:17-jre-jammy

# Set non-root user for security
RUN useradd -m myapp
USER myapp

# Create and set working directory
WORKDIR /app

# Copy the JAR file from the builder stage
COPY --from=builder --chown=myapp:myapp /app/build/libs/*.jar app.jar

# Set environment variables for Cloud Run
ENV PORT=8080

# Expose the port
EXPOSE 8080

# Start the application with container-optimized settings
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]