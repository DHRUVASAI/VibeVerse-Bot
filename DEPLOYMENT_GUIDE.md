# VibeVerse Backend Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Railway (Recommended - Easiest)

1. **Sign up at [Railway.app](https://railway.app)**
2. **Install Railway CLI** (optional):
   ```bash
   npm install -g @railway/cli
   ```

3. **Deploy via GitHub:**
   - Go to [railway.app/new](https://railway.app/new)
   - Click "Deploy from GitHub repo"
   - Select your `FEDF_30009` repository
   - Set root directory to `/server`
   - Railway will auto-detect Node.js

4. **Configure Environment Variables:**
   Go to your project → Variables → Add all from `.env`:
   ```
   TMDB_API_KEY=e04853aa5fd407eef838275300f6c430
   YOUTUBE_API_KEY=<your_key>
   SPOTIFY_CLIENT_ID=3a8f1fcc6a1f44eba99c4df08018ad46
   SPOTIFY_CLIENT_SECRET=a4c37da0a21e4b9c9b99acf1e8af5a31
   ENABLE_CLIQ_BOT=true
   ENABLE_SALESIQ_BOT=true
   PORT=5000
   ```

5. **Get Your URL:**
   - Railway will provide: `https://vibeverse-backend-production.up.railway.app`
   - Copy this URL for webhook configuration

---

### Option 2: Render.com (Free Tier Available)

1. **Sign up at [Render.com](https://render.com)**

2. **Deploy:**
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Set root directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Add Environment Variables** (same as Railway)

4. **Your URL:** `https://vibeverse-backend.onrender.com`

---

### Option 3: Heroku (Simple CLI Deployment)

1. **Install Heroku CLI:**
   ```bash
   npm install -g heroku
   ```

2. **Login and Create App:**
   ```bash
   heroku login
   cd server
   heroku create vibeverse-backend
   ```

3. **Set Environment Variables:**
   ```bash
   heroku config:set TMDB_API_KEY=e04853aa5fd407eef838275300f6c430
   heroku config:set SPOTIFY_CLIENT_ID=3a8f1fcc6a1f44eba99c4df08018ad46
   heroku config:set SPOTIFY_CLIENT_SECRET=a4c37da0a21e4b9c9b99acf1e8af5a31
   heroku config:set ENABLE_CLIQ_BOT=true
   heroku config:set ENABLE_SALESIQ_BOT=true
   ```

4. **Deploy:**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku master
   ```

5. **Your URL:** `https://vibeverse-backend.herokuapp.com`

---

### Option 4: Vercel (Serverless)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy from server directory:**
   ```bash
   cd server
   vercel
   ```

3. **Add Environment Variables** via Vercel Dashboard

4. **Your URL:** `https://vibeverse-backend.vercel.app`

---

## 📝 After Deployment

### 1. Test Your Deployed Backend

```bash
# Replace with your actual URL
curl https://your-app-url.railway.app/api/health
```

Expected response:
```json
{
  "ok": true,
  "services": {
    "cliqBot": true,
    "salesiqBot": true,
    "database": false,
    "scheduler": false,
    "crm": false
  }
}
```

### 2. Update Webhook URLs

Run the provided PowerShell script to automatically update all webhook URLs:

```powershell
.\update-webhook-urls.ps1 -DeployedUrl "https://your-app-url.railway.app"
```

Or manually update these files:
- `plugin-manifest.json` - Update all webhook URLs
- `salesiq-bot-config.json` - Update webhook endpoints

### 3. Configure in Zoho Cliq

1. Go to [Zoho Cliq Developer Console](https://cliq.zoho.com/api/v2)
2. Click "Create Extension"
3. Upload `plugin-manifest.json`
4. Install extension to your organization
5. Test commands:
   - `/vibeverse mood`
   - `/vibeverse recommend`
   - `/vibeverse trending`

### 4. Configure in Zoho SalesIQ

1. Go to SalesIQ Settings → Bots
2. Click "Add Bot" → "Import Bot"
3. Upload `salesiq-bot-config.json`
4. Configure webhook URLs in bot settings
5. Test on your website

---

## 🔧 Environment Variables Reference

### Required (Minimum)
- `TMDB_API_KEY` - Already in .env (e04853aa5fd407eef838275300f6c430)
- `SPOTIFY_CLIENT_ID` - Already in .env (3a8f1fcc6a1f44eba99c4df08018ad46)
- `SPOTIFY_CLIENT_SECRET` - Already in .env (a4c37da0a21e4b9c9b99acf1e8af5a31)
- `ENABLE_CLIQ_BOT=true`
- `ENABLE_SALESIQ_BOT=true`

### Optional (Enhanced Features)
- `YOUTUBE_API_KEY` - For YouTube music videos
- `MONGODB_URI` - For data persistence
- `ZOHO_CRM_ACCESS_TOKEN` - For CRM integration
- `ZOHO_CRM_REFRESH_TOKEN` - For CRM token refresh
- `ZOHO_CRM_CLIENT_ID` - CRM OAuth client
- `ZOHO_CRM_CLIENT_SECRET` - CRM OAuth secret
- `ENABLE_AUTO_CRM_SYNC=true` - Auto-sync to CRM

---

## 📊 Deployment Checklist

- [ ] Choose deployment platform (Railway recommended)
- [ ] Deploy backend to cloud
- [ ] Verify deployment with health check
- [ ] Copy deployed URL
- [ ] Run webhook URL update script
- [ ] Upload extension to Cliq
- [ ] Test all bot commands
- [ ] Upload bot to SalesIQ
- [ ] Test conversational flows
- [ ] Record demo video
- [ ] Prepare submission documentation

---

## 🎯 Next Steps

1. **Deploy Now:** Follow Railway deployment steps above (5 minutes)
2. **Update URLs:** Run the PowerShell script to update webhooks
3. **Test:** Install in Cliq and test commands
4. **Submit:** Upload to Zoho Marketplace

---

## 🆘 Troubleshooting

**Bot not responding?**
- Check webhook URL is correct
- Verify environment variables are set
- Check server logs for errors

**Commands not working?**
- Ensure bot is installed in Cliq
- Check command syntax matches manifest
- Verify authentication tokens

**API errors?**
- Check TMDB API key is valid
- Verify Spotify credentials
- Check rate limits

---

## 📞 Support

For deployment issues:
1. Check Railway/Render logs
2. Test health endpoint
3. Verify environment variables
4. Check network connectivity

Your backend is ready to deploy! Choose a platform and follow the guide above.
