# 🚀 VibeVerse Backend Deployment Guide

## Quick Deploy Options

### Option 1: Railway (Recommended - Easiest) ⭐

1. **Go to [Railway.app](https://railway.app/)** and sign in with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your **VibeVerse-Bot** repository
4. Railway will auto-detect Node.js and deploy
5. **Add Environment Variables**:
   - Click on your service → **Variables** tab
   - Add all variables from `server/.env.template`
6. **Get your URL**: 
   - Click **Settings** → Find your **Public Domain**
   - Example: `https://vibeverse-bot-production.up.railway.app`

**Cost**: Free tier includes 500 hours/month (enough for testing)

---

### Option 2: Render (Free Plan Available)

1. **Go to [Render.com](https://render.com/)** and sign in with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your **VibeVerse-Bot** repository
4. Configure:
   - **Name**: `vibeverse-backend`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. **Add Environment Variables** (from Environment tab)
6. Click **"Create Web Service"**
7. **Get your URL**: 
   - Example: `https://vibeverse-backend.onrender.com`

**Cost**: Free (service spins down after 15 min of inactivity)

---

### Option 3: Heroku (Classic Option)

1. **Install Heroku CLI**: `npm install -g heroku`
2. **Login**: `heroku login`
3. **Create app**:
   ```bash
   cd "c:\Users\Dhruva Sai\Desktop\VibeVerseZOHO\VibeVerse"
   heroku create vibeverse-bot-yourname
   ```
4. **Set environment variables**:
   ```bash
   heroku config:set TMDB_API_KEY=your_key_here
   heroku config:set YOUTUBE_API_KEY=your_key_here
   # Add all other variables from .env.template
   ```
5. **Deploy**:
   ```bash
   git push heroku master
   ```
6. **Get your URL**: `https://vibeverse-bot-yourname.herokuapp.com`

**Cost**: Free tier discontinued, paid plans start at $5/month

---

### Option 4: Azure App Service

1. **Go to [Azure Portal](https://portal.azure.com)**
2. Create **App Service** → **Web App**
3. Configure:
   - **Runtime**: Node 18 LTS
   - **Pricing**: Free F1
4. **Deploy**:
   - Use VS Code Azure Extension, or
   - GitHub Actions (Azure generates workflow)
5. **Add environment variables** in **Configuration** → **Application settings**
6. **Get your URL**: `https://vibeverse-bot.azurewebsites.net`

---

## 📝 After Deployment: Update Webhook URLs

Once deployed, you need to update the webhook URLs in your manifest files:

### Update Cliq Extension Manifest

```bash
# Replace YOUR_DEPLOYED_URL with your actual URL
cd "c:\Users\Dhruva Sai\Desktop\VibeVerseZOHO\VibeVerse"
```

Edit `plugin-manifest.json`:
- Change all webhook URLs from `http://localhost:5000` to `https://YOUR_DEPLOYED_URL`

Example:
```json
"webhook": {
  "url": "https://vibeverse-bot-production.up.railway.app/bot/webhook"
}
```

### Update SalesIQ Bot Config

Edit `salesiq-bot-config.json`:
- Change all webhook URLs to your deployed URL

---

## 🔧 Environment Variables to Set

Copy these from `server/.env.template` and add your values:

### Required (for basic functionality):
- `TMDB_API_KEY` - Get from [TMDB](https://www.themoviedb.org/settings/api)
- `YOUTUBE_API_KEY` - Get from [Google Cloud Console](https://console.cloud.google.com/)

### Optional (for music features):
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`

### Optional (for data persistence):
- `MONGODB_URI` - Get from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Optional (for CRM sync):
- `ZOHO_CRM_ACCESS_TOKEN`
- `ZOHO_CRM_REFRESH_TOKEN`
- `ZOHO_CRM_CLIENT_ID`
- `ZOHO_CRM_CLIENT_SECRET`

### Bot Configuration:
- `ENABLE_CLIQ_BOT=true`
- `ENABLE_SALESIQ_BOT=true`

---

## ✅ Testing Your Deployment

### 1. Test Health Endpoint
```bash
curl https://YOUR_DEPLOYED_URL/api/health
```

Should return:
```json
{"ok":true,"services":{...}}
```

### 2. Test TMDB Endpoint
```bash
curl https://YOUR_DEPLOYED_URL/api/tmdb/movie/550
```

Should return Fight Club movie data.

### 3. Test Bot Webhook
In Cliq or SalesIQ, configure the webhook URL and test a command.

---

## 🐛 Troubleshooting

### Service won't start:
- Check logs in your platform dashboard
- Verify all environment variables are set
- Ensure `PORT` is set correctly (Railway/Render auto-set this)

### 404 errors:
- Verify webhook URLs don't have trailing slashes
- Check that routes match exactly

### API errors:
- Verify TMDB_API_KEY is valid
- Check CORS settings if calling from frontend

---

## 📦 What Gets Deployed

Your deployment includes:
- ✅ Express backend server
- ✅ TMDB movie API proxy
- ✅ YouTube music API proxy
- ✅ Cliq bot webhook handler
- ✅ SalesIQ bot webhook handler
- ✅ MongoDB integration (if configured)
- ✅ Zoho CRM sync (if configured)
- ✅ Scheduled jobs (mood summaries, cache refresh)

---

## 🎯 Next Steps

After deployment:
1. ✅ Update webhook URLs in manifest files
2. ✅ Test all endpoints
3. ✅ Install extension in Cliq or configure SalesIQ bot
4. ✅ Test bot commands
5. ✅ Record demo video
6. ✅ Submit to Zoho Marketplace

---

## 💡 Recommended: Railway

For this project, I recommend **Railway** because:
- ✅ Easiest setup (auto-detects everything)
- ✅ Free tier is generous
- ✅ Doesn't sleep (unlike Render free tier)
- ✅ Simple environment variable management
- ✅ GitHub integration
- ✅ Great for Node.js apps

**Deploy Now**: [railway.app/new](https://railway.app/new)
