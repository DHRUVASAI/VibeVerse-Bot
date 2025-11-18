# ✅ VibeVerse - Zoho Submission Checklist

## 📋 Pre-Deployment

- [ ] All features tested locally
- [ ] Backend server running on `http://localhost:5000`
- [ ] Frontend working on `http://localhost:5173`
- [ ] Environment variables configured in `server/.env`
- [ ] Bot commands working
- [ ] Database integration tested (if using MongoDB)

---

## 🚀 Deployment Steps

### 1. Choose Deployment Platform
- [ ] Railway (Recommended) ⭐
- [ ] Render
- [ ] Heroku
- [ ] Azure App Service

### 2. Deploy Backend
- [ ] Create account on chosen platform
- [ ] Connect GitHub repository: `https://github.com/DHRUVASAI/VibeVerse-Bot`
- [ ] Configure build settings:
  - Root directory: `server`
  - Build command: `npm install`
  - Start command: `npm start`
- [ ] Add environment variables (see DEPLOYMENT_GUIDE.md)
- [ ] Deploy and wait for success
- [ ] Copy deployed URL (e.g., `https://vibeverse-bot.railway.app`)

### 3. Update Webhook URLs
- [ ] Run update script:
  ```powershell
  .\update-webhooks.ps1 https://YOUR-DEPLOYED-URL
  ```
  OR
  ```bash
  ./update-webhooks.sh https://YOUR-DEPLOYED-URL
  ```
- [ ] Verify changes in:
  - [ ] `plugin-manifest.json`
  - [ ] `salesiq-bot-config.json`
- [ ] Commit and push changes:
  ```bash
  git add .
  git commit -m "Update webhook URLs to production"
  git push origin master
  ```

### 4. Test Deployed Backend
- [ ] Test health endpoint:
  ```bash
  curl https://YOUR-DEPLOYED-URL/api/health
  ```
- [ ] Test TMDB API:
  ```bash
  curl https://YOUR-DEPLOYED-URL/api/tmdb/movie/550
  ```
- [ ] Test bot webhook:
  ```bash
  curl -X POST https://YOUR-DEPLOYED-URL/bot/webhook -H "Content-Type: application/json" -d '{"text":"/mood happy"}'
  ```

---

## 🤖 Cliq Extension Testing

### 5. Install in Cliq
- [ ] Go to Zoho Cliq → **Marketplace** → **Build**
- [ ] Create new extension → Upload `plugin-manifest.json`
- [ ] Configure webhook secret (if required)
- [ ] Install extension to your Cliq workspace

### 6. Test Cliq Bot Commands
- [ ] `/mood` - Mood selection works
- [ ] `/recommend happy movies` - Returns movie recommendations
- [ ] `/recommend sad music` - Returns music recommendations
- [ ] `/filter language:English year:2023` - Filters work
- [ ] `/watchlist add Inception` - Watchlist add works
- [ ] `/watchlist view` - Shows watchlist
- [ ] `/history week` - Shows mood history
- [ ] `/trending action` - Shows trending by mood
- [ ] `/summary` - Generates weekly summary

### 7. Test Interactive Cards
- [ ] Mood selection buttons work
- [ ] Movie recommendation cards display correctly
- [ ] "Where to Watch" buttons work
- [ ] "Add to Watchlist" buttons work
- [ ] Filter forms submit correctly
- [ ] Navigation buttons work

---

## 💬 SalesIQ Bot Testing (Alternative)

### 8. Configure in SalesIQ
- [ ] Go to Zoho SalesIQ → **Settings** → **Bots**
- [ ] Create new bot → Import `salesiq-bot-config.json`
- [ ] Configure webhook endpoints
- [ ] Enable bot on website

### 9. Test SalesIQ Bot Intents
- [ ] Greeting intent triggers welcome message
- [ ] "I'm feeling happy" → Mood selection works
- [ ] "Show me movies" → Returns recommendations
- [ ] "Add to watchlist" → Watchlist functionality works
- [ ] "Show my history" → Displays mood history
- [ ] "What's trending" → Shows trending content
- [ ] Webhook responses are fast (<3 seconds)

---

## 📊 Database & CRM Testing (Optional)

### 10. MongoDB Integration (if configured)
- [ ] User profiles saved to database
- [ ] Mood history tracked correctly
- [ ] Watchlist persists across sessions
- [ ] Weekly summaries generated
- [ ] Trending cache updates

### 11. Zoho CRM Sync (if configured)
- [ ] New users synced as leads
- [ ] Mood activities logged
- [ ] Watchlist synced as notes
- [ ] CRM data visible in Zoho CRM

---

## 📹 Demo Video & Documentation

### 12. Create Demo Video
- [ ] Record 2-3 minute demo showing:
  - [ ] Mood selection
  - [ ] Movie recommendations
  - [ ] Music recommendations
  - [ ] Watchlist management
  - [ ] Mood history
  - [ ] Trending content
  - [ ] Filters in action
- [ ] Upload to YouTube/Vimeo
- [ ] Add video link to README

### 13. Update Documentation
- [ ] README.md has clear installation instructions
- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] Screenshots added
- [ ] Architecture diagram (optional)

---

## 📦 Submission Preparation

### 14. Final Checks
- [ ] All console errors fixed
- [ ] No hardcoded URLs (except in config)
- [ ] Error handling works properly
- [ ] Loading states show correctly
- [ ] Toast notifications work
- [ ] Mobile responsive (if web UI included)

### 15. Prepare Submission Files
- [ ] `plugin-manifest.json` OR `salesiq-bot-config.json` (choose one)
- [ ] Screenshots (5-10 images showing key features)
- [ ] Demo video URL
- [ ] README.md with installation guide
- [ ] Privacy policy (if collecting user data)
- [ ] Terms of service (if required)

### 16. Submission Details
- [ ] **Name**: VibeVerse - Mood-Based Entertainment Bot
- [ ] **Tagline**: Your Mood. Your Movie. AI-powered recommendations in Cliq.
- [ ] **Category**: Entertainment / Productivity
- [ ] **Description**: Write compelling 500-word description
- [ ] **Key Features**: List 5-7 bullet points
- [ ] **Use Cases**: Describe 2-3 real scenarios
- [ ] **Pricing**: Free (for Marketplace review)

---

## 🎯 Submission

### 17. Submit to Zoho Marketplace
- [ ] Go to Zoho Marketplace → **Developer** → **My Extensions**
- [ ] Click **Create Extension**
- [ ] Upload manifest file
- [ ] Fill in all details
- [ ] Upload screenshots
- [ ] Add demo video link
- [ ] Submit for review

### 18. Post-Submission
- [ ] Monitor submission status
- [ ] Respond to reviewer questions promptly
- [ ] Fix any issues identified
- [ ] Resubmit if needed

---

## 🎉 Success Criteria

Your submission is ready when:
- ✅ Backend deployed and accessible
- ✅ Webhook URLs updated in manifest
- ✅ All bot commands tested and working
- ✅ Demo video created and uploaded
- ✅ Documentation complete
- ✅ No critical bugs or errors
- ✅ User experience is smooth

---

## 📞 Support

If you encounter issues:
1. Check deployment logs on your platform
2. Verify environment variables are set
3. Test webhook endpoints with curl
4. Check Cliq/SalesIQ bot logs
5. Review error messages in console

---

## 🏆 Current Status

**Update this section as you complete steps:**

- [ ] Backend Deployed: `___________________`
- [ ] Webhook URLs Updated: ❌
- [ ] Cliq Extension Tested: ❌
- [ ] Demo Video Created: ❌
- [ ] Ready for Submission: ❌

---

**Last Updated**: ${new Date().toISOString()}
