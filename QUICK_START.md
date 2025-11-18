# 🚀 Quick Deploy to Railway (5 Minutes)

## Step 1: Deploy Backend

1. **Click this button** to deploy to Railway:

   [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template?code=YOUR_TEMPLATE_CODE)

   OR manually:
   
   - Go to **[railway.app/new](https://railway.app/new)**
   - Sign in with GitHub
   - Click **"Deploy from GitHub repo"**
   - Select **DHRUVASAI/VibeVerse-Bot**
   - Railway auto-detects Node.js and deploys

2. **Add Environment Variables** (click on your service → Variables tab):

   ```env
   TMDB_API_KEY=your_tmdb_api_key_here
   YOUTUBE_API_KEY=your_youtube_api_key_here
   ENABLE_CLIQ_BOT=true
   ENABLE_SALESIQ_BOT=true
   ```

   Get API keys:
   - TMDB: https://www.themoviedb.org/settings/api
   - YouTube: https://console.cloud.google.com/

3. **Get your deployed URL**:
   - Click **Settings** → Copy your **Public Domain**
   - Example: `https://vibeverse-bot-production.up.railway.app`

---

## Step 2: Update Webhook URLs

Run this command with YOUR deployed URL:

```powershell
# Windows PowerShell
cd "c:\Users\Dhruva Sai\Desktop\VibeVerseZOHO\VibeVerse"
.\update-webhooks.ps1 https://YOUR-RAILWAY-URL
```

```bash
# Mac/Linux
cd /path/to/VibeVerse
./update-webhooks.sh https://YOUR-RAILWAY-URL
```

Then commit and push:
```bash
git add .
git commit -m "Update webhook URLs to Railway"
git push origin main
```

---

## Step 3: Test Deployment

```bash
# Test health endpoint
curl https://YOUR-RAILWAY-URL/api/health

# Test TMDB API
curl https://YOUR-RAILWAY-URL/api/tmdb/movie/550
```

You should see JSON responses with movie data.

---

## Step 4: Install in Cliq

1. Go to **Zoho Cliq** → **Marketplace** → **Build**
2. **Create new extension** → Upload `plugin-manifest.json`
3. **Install** to your workspace
4. Test command: `/mood happy`

---

## Step 5: Test Bot Commands

In Cliq, try these commands:

```
/mood
/recommend happy movies
/watchlist add Inception
/history week
/trending action
```

---

## ✅ You're Done!

Your VibeVerse bot is now:
- ✅ Deployed on Railway
- ✅ Webhook URLs updated
- ✅ Ready to use in Cliq
- ✅ Ready for Zoho Marketplace submission

---

## 🎬 Create Demo Video

Record a 2-minute video showing:
1. Mood selection with `/mood`
2. Getting recommendations
3. Adding to watchlist
4. Viewing history

Upload to YouTube and add link to README.

---

## 📦 Submit to Marketplace

1. Go to **Zoho Marketplace Developer Portal**
2. **Create Extension** → Upload `plugin-manifest.json`
3. Add screenshots and demo video
4. Submit for review

---

## 🆘 Troubleshooting

**Service won't start?**
- Check Railway logs for errors
- Verify TMDB_API_KEY is set correctly

**Webhook not responding?**
- Verify URL doesn't have trailing slash
- Check bot configuration in Cliq

**Commands not working?**
- Reinstall extension in Cliq
- Check webhook secret matches

---

## 🎉 Success!

Your bot is live! Share it with your team and submit to Zoho Marketplace.

**Deployed URL**: _________________________
**Cliq Installed**: ❌ / ✅
**Demo Video**: _________________________
**Submission Status**: _________________________
