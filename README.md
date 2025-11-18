# 🎬 VibeVerse - Zoho Cliq Extension

**Your Mood. Your Movie. AI-powered entertainment recommendations in Zoho Cliq.**

VibeVerse is a mood-based movie & music recommendation bot for Zoho Cliq and SalesIQ. Select your mood and get instant personalized recommendations for movies (via TMDB) and music (via YouTube/Spotify). Features include watchlist management, mood history tracking, trending content, and streaming availability.

## 🚀 **[Quick Deploy to Railway](QUICK_START.md)** | 📋 **[Submission Checklist](SUBMISSION_CHECKLIST.md)** | 📖 **[Full Deployment Guide](DEPLOYMENT_GUIDE.md)**

## ✨ Features

### 🤖 Cliq Bot Commands
- `/mood` - Interactive mood selection with visual cards
- `/recommend [mood] [movies|music|both]` - Get instant recommendations
- `/filter language:English year:2023` - Apply custom filters
- `/watchlist [add|view|clear]` - Manage your personal watchlist
- `/history [week|month|all]` - View mood history and past recommendations
- `/trending [mood]` - Get trending content by mood
- `/summary` - Generate weekly vibe-based watchlist summary

### 💬 SalesIQ Bot
- Natural language conversations
- Mood-based recommendations
- Data collection and CRM sync
- Interactive quick replies
- Visitor engagement workflows

### 🎯 Core Features
- **Movie Recommendations** - Powered by TMDB API
- **Music Discovery** - YouTube music videos + Spotify playlists
- **Streaming Availability** - Where to watch (by region)
- **Smart Filtering** - Language, year, genre filters
- **Mood History** - Track your vibe over time
- **Weekly Summaries** - Get mood-based watchlist digests
- **CRM Integration** - Auto-sync to Zoho CRM (optional)
- **MongoDB Storage** - Persistent user data (optional)

---

## 🚀 Quick Start

### Option 1: Deploy to Railway (Recommended - 5 minutes)

1. **Deploy**: Go to [railway.app/new](https://railway.app/new) → Deploy from GitHub → Select this repo
2. **Add API Keys**: Add `TMDB_API_KEY` and `YOUTUBE_API_KEY` in Railway Variables
3. **Get URL**: Copy your Railway public domain (e.g., `https://vibeverse-bot.railway.app`)
4. **Update Webhooks**: Run `.\update-webhooks.ps1 https://YOUR-RAILWAY-URL`
5. **Install in Cliq**: Upload `plugin-manifest.json` to Zoho Cliq Marketplace

**[📖 Full Quick Start Guide →](QUICK_START.md)**

### Option 2: Local Development

See [Local Development](#local-development-optional) section below.

---

## 📦 What's Included
- `index.html`, `script.js`, `config.js` — frontend app
- `server/` — Node Express proxy (TMDb & YouTube endpoints, caching)

## 📦 What's Included

### Bot & Extension Files
- `plugin-manifest.json` - Zoho Cliq extension configuration
- `salesiq-bot-config.json` - Zoho SalesIQ bot configuration

### Backend (Server)
- `server/index.js` - Express server with API endpoints
- `server/cliq-bot-handler.js` - Cliq webhook handler & card generator
- `server/salesiq-handler.js` - SalesIQ conversation handler
- `server/enhanced-api-service.js` - 19 REST API endpoints
- `server/zoho-crm-service.js` - CRM integration & sync
- `server/scheduler-service.js` - Automated jobs (summaries, cache)
- `server/database-service.js` - MongoDB operations
- `server/models.js` - 7 MongoDB schemas

### Frontend (Web App)
- `index.html`, `script.js`, `style.css` - Web interface
- `config.js` - API configuration

### Deployment Files
- `railway.json` - Railway deployment config
- `render.yaml` - Render deployment config
- `Procfile` - Heroku deployment config
- `.deployment` - Azure deployment config
- `update-webhooks.ps1/.sh` - Webhook URL update scripts

### Documentation
- `DEPLOYMENT_GUIDE.md` - Complete deployment instructions
- `QUICK_START.md` - 5-minute Railway setup
- `SUBMISSION_CHECKLIST.md` - Marketplace submission guide
- `CLIQ_SALESIQ_README.md` - Bot features & usage
- `BOT_QUICK_REFERENCE.md` - Command reference

---

## 🔧 Environment Variables

Required for deployment:

```env
# Required - Get from https://www.themoviedb.org/settings/api
TMDB_API_KEY=your_tmdb_api_key

# Required - Get from https://console.cloud.google.com/
YOUTUBE_API_KEY=your_youtube_api_key

# Bot Configuration
ENABLE_CLIQ_BOT=true
ENABLE_SALESIQ_BOT=true

# Optional - MongoDB for data persistence
MONGODB_URI=mongodb+srv://...

# Optional - Spotify for music features
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# Optional - Zoho CRM integration
ZOHO_CRM_ACCESS_TOKEN=your_access_token
ZOHO_CRM_REFRESH_TOKEN=your_refresh_token
ZOHO_CRM_CLIENT_ID=your_client_id
ZOHO_CRM_CLIENT_SECRET=your_client_secret
ZOHO_CRM_API_DOMAIN=https://www.zohoapis.com
ENABLE_AUTO_CRM_SYNC=true
```

**[📖 See server/.env.template for all options](server/.env.template)**

---

## 📱 Installation in Cliq

### Method 1: From Marketplace (After Submission)
1. Go to Zoho Cliq → **Marketplace**
2. Search for **"VibeVerse"**
3. Click **Install**

### Method 2: Manual Upload (For Testing)
1. Deploy backend to Railway/Render
2. Update webhook URLs: `.\update-webhooks.ps1 https://YOUR-URL`
3. Go to Zoho Cliq → **Marketplace** → **Build**
4. Create new extension → Upload `plugin-manifest.json`
5. Install to your workspace

---

## 🎮 Usage

### In Cliq

```
# Get mood-based recommendations
/mood
/recommend happy movies
/recommend sad music

# Apply filters
/filter language:English year:2023

# Manage watchlist
/watchlist add Inception
/watchlist view

# View history
/history week

# Get trending content
/trending action

# Get weekly summary
/summary
```

### In SalesIQ

Just chat naturally:
- "I'm feeling happy"
- "Show me some comedy movies"
- "Add this to my watchlist"
- "What's trending?"

---

## 🏗️ Architecture

```
User (Cliq/SalesIQ) → Webhook → Express Server → External APIs
                                      ↓
                                  MongoDB (optional)
                                      ↓
                                 Zoho CRM (optional)
```

**External APIs Used:**
- TMDB - Movie data & streaming availability
- YouTube - Music video search
- Spotify - Playlist recommendations
- Zoho CRM - User data sync

---

## 🧪 Local Development (Optional)

## 🧪 Local Development (Optional)

### 1. Clone Repository

```bash
git clone https://github.com/DHRUVASAI/VibeVerse-Bot.git
cd VibeVerse-Bot
```

### 2. Setup Backend

```bash
cd server
npm install

# Create .env file (copy from .env.template)
# Add your TMDB_API_KEY and YOUTUBE_API_KEY

npm start  # Backend runs on http://localhost:5000
```

### 3. Setup Frontend (Optional - for web UI)

```bash
# In a new terminal
cd ..  # Back to root
npm install  # or pnpm install

npm run dev  # Frontend runs on http://localhost:5173
```

### 4. Test Health

```bash
curl http://localhost:5000/api/health
```

---

## 📚 Documentation

- **[🚀 Quick Start Guide](QUICK_START.md)** - Deploy in 5 minutes
- **[📋 Submission Checklist](SUBMISSION_CHECKLIST.md)** - Complete submission guide
- **[📖 Deployment Guide](DEPLOYMENT_GUIDE.md)** - Detailed deployment instructions
- **[🤖 Cliq/SalesIQ README](CLIQ_SALESIQ_README.md)** - Bot features & architecture
- **[📝 Bot Command Reference](BOT_QUICK_REFERENCE.md)** - All commands explained
- **[🛠️ Setup Guide](SETUP_GUIDE.md)** - Environment setup
- **[📊 Implementation Summary](IMPLEMENTATION_SUMMARY.md)** - Feature breakdown

---

## 🎬 Demo

**Video Demo**: _(Add your YouTube link here after creating demo)_

**Screenshots**:
- Mood Selection Card
- Movie Recommendations
- Watchlist Management
- Mood History
- Trending Content

---

## 🚢 Deployment Options

| Platform | Difficulty | Free Tier | Best For |
|----------|-----------|-----------|----------|
| **Railway** ⭐ | Easy | 500 hrs/mo | Quick testing |
| **Render** | Easy | Yes (sleeps) | Free hosting |
| **Heroku** | Medium | No (paid) | Production |
| **Azure** | Hard | Yes (limited) | Enterprise |

**Recommended**: Railway for fastest deployment.

---

## 🧪 Testing

### Test Backend Endpoints

```bash
# Health check
curl https://YOUR-URL/api/health

# TMDB movie data
curl https://YOUR-URL/api/tmdb/movie/550

# Streaming providers
curl https://YOUR-URL/api/tmdb/movie/550/watch/providers

# Bot webhook (test)
curl -X POST https://YOUR-URL/bot/webhook \
  -H "Content-Type: application/json" \
  -d '{"text":"/mood happy"}'
```

### Test in Cliq

```
/mood
/recommend happy movies
/watchlist add Inception
```

---

## 🤝 Contributing

This project is for Zoho Marketplace submission. Contributions welcome after initial submission.

---

## 📄 License

MIT License

---

## 🙋 Support

**Issues**: [GitHub Issues](https://github.com/DHRUVASAI/VibeVerse-Bot/issues)
**Email**: your-email@example.com

---

## 🏆 Acknowledgments

- **TMDB** - Movie data API
- **YouTube** - Music video search
- **Spotify** - Playlist recommendations
- **Zoho** - Cliq & SalesIQ platform

---

## 📊 Stats

- **7 Bot Commands**
- **19 API Endpoints**
- **7 MongoDB Collections**
- **4 Scheduled Jobs**
- **3 External APIs**
- **2 Bot Platforms** (Cliq + SalesIQ)

---

**Made for Zoho Marketplace** 🚀

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

---

**Repository**: https://github.com/DHRUVASAI/VibeVerse-Bot
**Status**: ✅ Ready for Deployment → 🔄 Testing → 📦 Marketplace Submission

This will attempt to hit `/api/health` on the configured port and report the result.

Notes on improved accuracy
- TMDb discover: the proxy canonicalizes query parameters before caching so similar queries hit the same cache key (higher cache hit-rate, fewer API calls).
- YouTube proxy: the server now forwards arbitrary YouTube query params (part/type/videoCategoryId/maxResults) and post-filters results to prefer uploads that indicate "official", "VEVO", "Topic", "audio" or "music video" — this improves music recommendation relevance and reduces noisy user-generated clips.
 - YouTube ranking: after searching, the proxy fetches video statistics (viewCount, likes, duration) for the top results and ranks items by viewCount. This improves relevance by surfacing popular official uploads first. All video-stat calls are cached to limit quota usage.

## Docker (proxy)

Build and run the proxy with Docker:

```powershell
cd server
docker build -t vibeverse-proxy .
docker run -e TMDB_API_KEY="<key>" -e YOUTUBE_API_KEY="<key>" -p 5174:5174 vibeverse-proxy
```

### Docker Compose (proxy + Redis)

For a production-like local environment with Redis caching, you can use Docker Compose. Create a `.env` file at the repo root with your keys:

```text
TMDB_API_KEY=your_tmdb_api_key_here
YOUTUBE_API_KEY=your_youtube_api_key_here
```

Then run:

```powershell
docker-compose up --build
```

This will start a Redis container and the proxy service. The proxy will connect to Redis for caching if `REDIS_HOST` is present (set by the compose file).

## Deployment notes

- The proxy is stateless but uses in-memory caching. For production with multiple instances, replace the in-memory cache with Redis or Memcached.
- Provide `TMDB_API_KEY` and `YOUTUBE_API_KEY` as environment variables at your hosting provider (Render, Heroku, etc.).
- Recommended simple deployment flow:
  - Host the static frontend on Vercel/Netlify (or serve from the same Node host).
  - Host the proxy on Render / Heroku / DigitalOcean App Platform. Use HTTPS and set environment variables in the service's dashboard.

### Platform specific hints
- Render: Create a Web Service from repo `server/` with start command `node index.js` and add environment variables in the service settings.
- Vercel / Netlify: Deploy only the frontend directory (root). Configure a environment variable or a proxy rewrites if you want to route `/api/*` to your server host.

## Security

- Never commit real API keys. `.env` is in `.gitignore` (do not add it to VCS).
- The proxy reduces key exposure and rate-limits requests, but API quotas still apply — consider caching longer TTLs for popular queries.

## Next steps you can ask me to do

- Replace in-memory cache with Redis for production multi-instance deployments.
- Add CI workflow for building & deploying frontend and proxy.
- Add integrated Docker Compose to run frontend + proxy locally.

---
Made for quick local development and safe publishing. If you want, I can add a Docker Compose and CI workflow next.
