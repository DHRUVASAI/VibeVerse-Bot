#!/bin/bash

# VibeVerse Quick Setup Script
# This script automates the initial setup process

echo "🎬 VibeVerse Setup Script"
echo "=========================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo "📦 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 16+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✅ Node.js ${NODE_VERSION} found${NC}"

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo -e "${YELLOW}⚠️  MongoDB not found on PATH${NC}"
    echo "If using MongoDB Atlas, you can ignore this warning"
else
    MONGO_VERSION=$(mongod --version | head -n 1)
    echo -e "${GREEN}✅ MongoDB found${NC}"
fi

echo ""
echo "📥 Installing server dependencies..."
cd server

# Install dependencies
if command -v pnpm &> /dev/null; then
    echo "Using pnpm..."
    pnpm install
elif command -v yarn &> /dev/null; then
    echo "Using yarn..."
    yarn install
else
    echo "Using npm..."
    npm install
fi

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

echo ""
echo "⚙️  Setting up environment..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    if [ -f .env.template ]; then
        cp .env.template .env
        echo -e "${GREEN}✅ Created .env file from template${NC}"
        echo -e "${YELLOW}⚠️  Please edit .env with your API keys and credentials${NC}"
    else
        echo -e "${RED}❌ .env.template not found${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  .env file already exists, skipping${NC}"
fi

echo ""
echo "🔍 Configuration checklist:"
echo "   [ ] MONGODB_URI - Database connection string"
echo "   [ ] TMDB_API_KEY - TMDB API key"
echo "   [ ] YOUTUBE_API_KEY - YouTube API key"
echo "   [ ] SPOTIFY_CLIENT_ID - Spotify client ID"
echo "   [ ] SPOTIFY_CLIENT_SECRET - Spotify client secret"
echo "   [ ] WEBHOOK_URL - Your public server URL"
echo ""

# Ask if user wants to start MongoDB locally
read -p "Do you want to start a local MongoDB instance? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v mongod &> /dev/null; then
        echo "Starting MongoDB on default port 27017..."
        mkdir -p ../data/db
        mongod --dbpath ../data/db --fork --logpath ../data/mongodb.log
        echo -e "${GREEN}✅ MongoDB started${NC}"
        echo "   Database path: ../data/db"
        echo "   Log file: ../data/mongodb.log"
    else
        echo -e "${RED}❌ mongod command not found${NC}"
    fi
fi

echo ""
echo "🧪 Running health check..."
# Start server in background for testing
npm start &
SERVER_PID=$!

# Wait for server to start
sleep 3

# Check health endpoint
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo -e "${GREEN}✅ Server is healthy${NC}"
else
    echo -e "${RED}❌ Health check failed${NC}"
fi

# Stop test server
kill $SERVER_PID 2>/dev/null

echo ""
echo "✅ Setup complete!"
echo ""
echo "📚 Next steps:"
echo "   1. Edit server/.env with your API keys"
echo "   2. Review SETUP_GUIDE.md for detailed instructions"
echo "   3. Start server: cd server && npm start"
echo "   4. Test health: curl http://localhost:5000/api/health"
echo "   5. Setup Cliq extension using plugin-manifest.json"
echo "   6. Setup SalesIQ bot using salesiq-bot-config.json"
echo ""
echo "📖 Documentation:"
echo "   - CLIQ_SALESIQ_README.md - Full documentation"
echo "   - SETUP_GUIDE.md - Step-by-step setup"
echo "   - BOT_QUICK_REFERENCE.md - Command reference"
echo "   - IMPLEMENTATION_SUMMARY.md - What was built"
echo ""
echo "🎉 Happy coding with VibeVerse!"
