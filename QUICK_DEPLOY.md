# 🚀 Quick Deploy - Get Live in 10 Minutes!

## Step 1: Deploy to Railway (5 minutes)

### Method A: One-Click Deploy
1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Connect your GitHub account
4. Select repository: `DHRUVASAI/FEDF_30009`
5. Set Root Directory: `server`
6. Click "Deploy Now"

### Method B: Railway CLI
```powershell
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize and deploy
cd server
railway init
railway up
```

## Step 2: Configure Environment Variables (2 minutes)

In Railway Dashboard → Variables, add:

```env
TMDB_API_KEY=e04853aa5fd407eef838275300f6c430
SPOTIFY_CLIENT_ID=3a8f1fcc6a1f44eba99c4df08018ad46
SPOTIFY_CLIENT_SECRET=a4c37da0a21e4b9c9b99acf1e8af5a31
ENABLE_CLIQ_BOT=true
ENABLE_SALESIQ_BOT=true
PORT=5000
```

## Step 3: Get Your URL (1 minute)

Railway provides a URL like:
```
https://vibeverse-backend-production.up.railway.app
```

Copy this URL!

## Step 4: Update Webhooks (1 minute)

Run in PowerShell:
```powershell
.\update-webhook-urls.ps1 -DeployedUrl "https://YOUR-RAILWAY-URL"
```

## Step 5: Test Backend (1 minute)

```bash
curl https://YOUR-RAILWAY-URL/api/health
```

Expected response:
```json
{"ok":true,"services":{"cliqBot":true,"salesiqBot":true}}
```

---

## ✅ You're Live!

Now you can:
1. Upload `plugin-manifest.json` to Zoho Cliq
2. Upload `salesiq-bot-config.json` to Zoho SalesIQ
3. Test your bot!

---

## 🎬 Testing Your Bot

### In Zoho Cliq:
```
/vibeverse mood
/vibeverse recommend
/vibeverse trending
/vibeverse watchlist
```

### In SalesIQ:
Open your website with SalesIQ widget and start a chat:
```
Show me happy movies
What should I watch when I'm sad?
Add to my watchlist
```

---

## 🔍 Troubleshooting

**Deployment failed?**
- Check Railway logs
- Verify `package.json` exists in `server/`
- Ensure Node.js version is 18+

**Bot not responding?**
- Verify webhook URLs are updated
- Check environment variables are set
- Test health endpoint

**Ready for submission!** 🎉
