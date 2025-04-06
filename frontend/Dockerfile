FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server.js ./server.js

RUN npm ci --production

ENV NODE_ENV=production
ENV PORT=8081

EXPOSE 8081

CMD ["node", "server.js"]
