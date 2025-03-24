# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies, including devDependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server.js ./server.js

# Install only production dependencies
RUN npm ci --production

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose port 8080
EXPOSE 8080

# Start the Express server
CMD ["node", "server.js"]
