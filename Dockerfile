FROM node:18-alpine

WORKDIR /app

# Copy only server files
COPY server/package*.json ./server/

# Install dependencies
WORKDIR /app/server
RUN npm ci --only=production || npm install --only=production

# Copy server source code
COPY server/ ./

# Set environment variables
ENV PORT=5000
ENV NODE_ENV=production

EXPOSE 5000

CMD ["node", "index.js"]
