# Use a specific version of OpenJDK for better reproducibility
FROM eclipse-temurin:17-jre-jammy

# Set non-root user for security
RUN useradd -m myapp
USER myapp

# Create and set working directory
WORKDIR /app

# Copy the JAR file
COPY build/libs/*.jar app.jar

# Configure JVM for containerized environment
# ENV JAVA_OPTS="-XX:InitialRAMPercentage=50.0 -XX:MaxRAMPercentage=70.0"

# Set environment variables for Cloud Run
ENV PORT=8080

# Expose the port
EXPOSE 8080

# Start the application with container-optimized settings
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]