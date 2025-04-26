FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies including dev dependencies
RUN npm ci

# Copy .env file BEFORE building
COPY .env .env

# Copy source files
COPY . .

# Build the application (now with access to .env)
RUN npm run clean
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy only what's needed from the builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/.env ./.env

# Install only production dependencies
RUN npm ci --production

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8081

EXPOSE 8081

CMD ["node", "server.js"]
