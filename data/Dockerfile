# Use the official PostgreSQL image from the Docker Hub
FROM postgres:latest

# Set environment variables for PostgreSQL
ENV POSTGRES_USER=user
ENV POSTGRES_PASSWORD=password
ENV POSTGRES_DB=listen_db
ENV POSTGRES_HOST_AUTH_METHOD=trust

# Copy the initialization script to the Docker image
COPY init.sql /docker-entrypoint-initdb.d/

CMD ["postgres", "-c", "port=6432"]

# Expose the PostgreSQL port
EXPOSE 6432