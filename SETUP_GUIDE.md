# 🚀 VibeVerse Setup Guide - Step by Step

This guide will walk you through setting up VibeVerse as a Zoho Cliq Extension and SalesIQ Bot from scratch.

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] Node.js 16+ installed
- [ ] MongoDB installed (local) or MongoDB Atlas account (cloud)
- [ ] Zoho account with access to Cliq, SalesIQ, and CRM
- [ ] TMDB API key ([Get it here](https://www.themoviedb.org/settings/api))
- [ ] YouTube Data API key ([Get it here](https://console.cloud.google.com/apis/credentials))
- [ ] Spotify Developer credentials ([Get them here](https://developer.spotify.com/dashboard))
- [ ] Public server URL (ngrok for testing or actual hosting)

---

## 🔧 Part 1: Server Setup

### Step 1: Install Dependencies

```bash
cd VibeVerse/server
npm install
```

This installs:
- express (web server)
- mongoose (MongoDB ODM)
- node-cron (scheduler)
- node-fetch (API calls)
- Other dependencies

### Step 2: Setup MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB locally
# Start MongoDB service
mongod --dbpath /path/to/data

# Database will be at: mongodb://localhost:27017/vibeverse
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/vibeverse`
4. Whitelist your IP address

### Step 3: Get API Keys

**TMDB API Key:**
1. Sign up at [themoviedb.org](https://www.themoviedb.org/)
2. Go to Settings → API
3. Request API key (free)
4. Copy the API Key (v3 auth)

**YouTube API Key:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable "YouTube Data API v3"
4. Create credentials → API Key
5. Copy the API key

**Spotify Credentials:**
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create an app
3. Copy Client ID and Client Secret

### Step 4: Configure Environment

Create `.env` file in `server/` directory:

```bash
cp .env.template .env
```

Edit `.env`:

```env
# Server
PORT=5000
NODE_ENV=production

# Database (use YOUR connection string)
MONGODB_URI=mongodb://localhost:27017/vibeverse

# APIs (use YOUR keys)
TMDB_API_KEY=abc123...
YOUTUBE_API_KEY=xyz789...
SPOTIFY_CLIENT_ID=spotify_id...
SPOTIFY_CLIENT_SECRET=spotify_secret...

# Zoho (configure later)
ENABLE_CLIQ_BOT=true
CLIQ_WEBHOOK_SECRET=
ENABLE_SALESIQ_BOT=true

# CRM (configure later)
ZOHO_CRM_ACCESS_TOKEN=
ZOHO_CRM_REFRESH_TOKEN=
ZOHO_CRM_CLIENT_ID=
ZOHO_CRM_CLIENT_SECRET=

# Features
ENABLE_SCHEDULER=true
ENABLE_AUTO_CRM_SYNC=false

# Webhook URL (replace with YOUR URL)
WEBHOOK_URL=https://your-server.com/api
```

### Step 5: Test Server

```bash
npm start
```

Check health endpoint:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "ok": true,
  "services": {
    "cliqBot": true,
    "salesiqBot": true,
    "database": true,
    "scheduler": true,
    "crm": false
  }
}
```

---

## 🌐 Part 2: Expose Server Publicly (For Testing)

### Option A: Using ngrok (Quick Testing)

```bash
# Install ngrok
npm install -g ngrok

# Start ngrok tunnel
ngrok http 5000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

**Update `.env`:**
```env
WEBHOOK_URL=https://abc123.ngrok.io/api
```

### Option B: Deploy to Cloud

Deploy to Heroku, AWS, Azure, or Zoho Catalyst. See deployment section in main README.

---

## 🤖 Part 3: Zoho Cliq Extension Setup

### Step 1: Create Cliq Extension

1. Open **Zoho Cliq**
2. Go to **Bots & Tools** → **Extensions** → **Create Extension**
3. Choose **Build from Scratch**

### Step 2: Configure Manifest

1. Upload or paste content from `plugin-manifest.json`
2. Update webhook URL in manifest:
   ```json
   "webhook": {
     "url": "https://your-server.com/bot/webhook"
   }
   ```

### Step 3: Configure Bot Settings

1. **Bot Name**: VibeVerse Bot
2. **Avatar**: Upload logo or use URL
3. **Commands**: All commands from manifest will be auto-configured

### Step 4: Set Webhook Secret

1. Generate a random secret: `openssl rand -hex 32`
2. Add to Cliq bot settings
3. Update `.env`:
   ```env
   CLIQ_WEBHOOK_SECRET=your_generated_secret
   ```

### Step 5: Test in Development

1. Click **Test** in Cliq extension page
2. Try commands:
   ```
   /mood
   /mood happy
   /recommend
   /watchlist view
   ```

### Step 6: Publish Extension

1. Click **Publish** in extension settings
2. Choose publishing scope (organization/public)
3. Install in your workspace

---

## 💬 Part 4: SalesIQ Bot Setup

### Step 1: Create SalesIQ Bot

1. Go to **Zoho SalesIQ** dashboard
2. Navigate to **Settings** → **Bots**
3. Click **Create Bot** → **Custom Bot**

### Step 2: Import Configuration

1. Choose **Import from JSON**
2. Upload `salesiq-bot-config.json`
3. Review imported intents and entities

### Step 3: Configure Webhooks

For each intent that has webhook enabled:

1. **Mood Intent**: `https://your-server.com/api/salesiq/mood`
2. **Recommend Intent**: `https://your-server.com/api/salesiq/recommend`
3. **Watchlist Intent**: `https://your-server.com/api/salesiq/watchlist`
4. **History Intent**: `https://your-server.com/api/salesiq/history`
5. **Trending Intent**: `https://your-server.com/api/salesiq/trending`
6. **Summary Intent**: `https://your-server.com/api/salesiq/summary`

### Step 4: Train the Bot

1. Review training phrases for each intent
2. Add more training phrases if needed
3. Test with SalesIQ bot tester

### Step 5: Deploy Bot

1. Click **Deploy** in bot settings
2. Assign bot to your website
3. Test on your website with SalesIQ widget

---

## 🔗 Part 5: Zoho CRM Integration (Optional)

### Step 1: Create CRM App

1. Go to [Zoho API Console](https://api-console.zoho.com/)
2. Click **Add Client** → **Server-based Applications**
3. Fill in details:
   - **Client Name**: VibeVerse
   - **Homepage URL**: Your server URL
   - **Authorized Redirect URI**: `http://localhost:5000/oauth/callback`
4. Copy **Client ID** and **Client Secret**

### Step 2: Generate Tokens

**Get Authorization Code:**
```
https://accounts.zoho.com/oauth/v2/auth?
  response_type=code&
  client_id=YOUR_CLIENT_ID&
  scope=ZohoCRM.modules.ALL,ZohoCRM.users.READ&
  redirect_uri=http://localhost:5000/oauth/callback&
  access_type=offline
```

**Exchange for Tokens:**
```bash
curl -X POST https://accounts.zoho.com/oauth/v2/token \
  -d "code=YOUR_AUTH_CODE" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "redirect_uri=http://localhost:5000/oauth/callback" \
  -d "grant_type=authorization_code"
```

Save the `access_token` and `refresh_token`.

### Step 3: Configure CRM in .env

```env
ZOHO_CRM_ACCESS_TOKEN=your_access_token
ZOHO_CRM_REFRESH_TOKEN=your_refresh_token
ZOHO_CRM_CLIENT_ID=your_client_id
ZOHO_CRM_CLIENT_SECRET=your_client_secret
ZOHO_CRM_API_DOMAIN=https://www.zohoapis.com
ENABLE_AUTO_CRM_SYNC=true
```

### Step 4: Add Custom Fields in CRM

Go to **Zoho CRM** → **Settings** → **Customization** → **Modules** → **Leads**

Add custom fields:
1. **VibeVerse User ID** (Single Line, API name: `VibeVerse_User_ID`)
2. **Last Mood** (Single Line, API name: `Last_Mood`)
3. **Total Interactions** (Number, API name: `Total_Interactions`)
4. **Favorite Genres** (Multi Line, API name: `Favorite_Genres`)
5. **Content Preference** (Picklist: movies/music/both, API name: `Content_Preference`)

### Step 5: Test CRM Sync

```bash
# Manual sync test
curl -X POST http://localhost:5000/api/v2/crm/sync/user/test-user-123
```

Check Zoho CRM to verify lead was created.

---

## ✅ Part 6: Verification & Testing

### Test Checklist

- [ ] Server health check passes
- [ ] MongoDB connection successful
- [ ] TMDB API working (test `/api/tmdb/discover`)
- [ ] YouTube API working (test `/api/youtube/search`)
- [ ] Cliq bot responds to `/mood` command
- [ ] SalesIQ bot responds in chat widget
- [ ] Mood history saved to database
- [ ] Watchlist operations work
- [ ] Trending endpoint returns data
- [ ] Weekly summary generates correctly
- [ ] CRM sync creates leads (if enabled)

### Manual Testing

**Test Cliq Bot:**
```
/mood happy
→ Should show mood selection card

/recommend romantic movies
→ Should return movie recommendations

/watchlist add Inception
→ Should add to watchlist

/history week
→ Should show mood history

/trending action
→ Should show trending action movies

/summary
→ Should generate weekly summary
```

**Test SalesIQ Bot:**
1. Open website with SalesIQ widget
2. Say "Hi"
3. Say "I'm feeling happy"
4. Say "recommend movies"
5. Check responses

**Test Database:**
```bash
# Connect to MongoDB
mongosh

# Switch to vibeverse database
use vibeverse

# Check collections
show collections

# View mood history
db.moodhistories.find().pretty()

# View watchlists
db.watchlists.find().pretty()
```

---

## 🎉 Part 7: Go Live!

### Pre-launch Checklist

- [ ] All tests passing
- [ ] Server deployed to production
- [ ] Environment variables configured in production
- [ ] MongoDB backed up
- [ ] Webhook URLs updated to production URLs
- [ ] Cliq extension published
- [ ] SalesIQ bot deployed
- [ ] CRM integration tested
- [ ] Monitoring set up

### Launch Steps

1. **Deploy Server**: Push to production hosting
2. **Update URLs**: Update all webhook URLs to production
3. **Publish Cliq Extension**: Make available to users
4. **Activate SalesIQ Bot**: Enable on website
5. **Enable Scheduler**: Set `ENABLE_SCHEDULER=true`
6. **Monitor**: Watch logs for errors

### Post-launch

1. Monitor server logs
2. Check database growth
3. Verify scheduled jobs run correctly
4. Collect user feedback
5. Monitor CRM sync status

---

## 🆘 Troubleshooting Common Issues

### Issue: Webhook Not Receiving Requests

**Solution:**
- Verify webhook URL is publicly accessible
- Check firewall settings
- Validate SSL certificate (HTTPS required)
- Check server logs for errors

### Issue: Database Connection Failed

**Solution:**
- Verify MongoDB is running
- Check connection string format
- Verify network access (for MongoDB Atlas)
- Check authentication credentials

### Issue: CRM Sync Failing

**Solution:**
- Refresh access token
- Verify CRM API scope permissions
- Check custom fields exist in CRM
- Review CRM API rate limits

### Issue: Scheduler Not Running

**Solution:**
- Verify `ENABLE_SCHEDULER=true` in .env
- Check server timezone settings
- Review cron expressions
- Check scheduler logs

---

## 📞 Support & Resources

- **Documentation**: See `CLIQ_SALESIQ_README.md`
- **Zoho Developer Docs**: [zoho.com/developer](https://www.zoho.com/developer/)
- **TMDB API Docs**: [developers.themoviedb.org](https://developers.themoviedb.org/)
- **MongoDB Docs**: [docs.mongodb.com](https://docs.mongodb.com/)

---

**You're all set! 🎬 Enjoy VibeVerse!**
