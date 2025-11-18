FROM node:18-alpine

# Set working directory to server
WORKDIR /app/server

# Copy package files first for better caching
COPY server/package*.json ./

# Install dependencies
RUN npm ci --only=production || npm install --only=production

# Copy server source code
COPY server/ ./

# Set environment variables
ENV PORT=5000
ENV NODE_ENV=production

EXPOSE 5000

# Start the server
CMD ["node", "index.js"]
