# 🎬 VibeVerse - Zoho Cliq Extension & SalesIQ Bot

**Your Mood. Your Movie.** AI-powered movie and music recommendations with full Zoho ecosystem integration.

## ✨ New Features

### 🤖 Zoho Cliq Bot
- **Interactive Commands**: `/mood`, `/recommend`, `/watchlist`, `/history`, `/trending`, `/summary`, `/filter`
- **Rich Card UI**: Beautiful mood selection cards and recommendation displays
- **Real-time Interactions**: Instant responses with button-based interactions

### 💬 SalesIQ Bot Integration
- **Natural Language Understanding**: Intent-based conversation flows
- **Quick Replies**: Pre-configured mood buttons for instant access
- **Conversational Flow**: Guided recommendation journey from mood to watchlist

### 📊 User Data Tracking
- **Mood History**: Track and analyze user moods over time
- **Watchlist Management**: Personal watchlist with watched status tracking
- **Recommendation History**: Keep track of all suggestions
- **User Preferences**: Save filters and favorite genres

### 🔥 Trending Content
- **Mood-based Trending**: Get trending movies filtered by your mood
- **Global Trending**: See what's popular this week
- **Smart Caching**: Fast responses with intelligent cache management

### 📅 Weekly Summaries
- **Automated Reports**: Get weekly vibe-based summaries every Monday
- **Mood Analytics**: See your top moods and viewing patterns
- **Progress Tracking**: Monitor movies added and watched

### 🔗 CRM Integration
- **Auto-sync to Zoho CRM**: User profiles synced as leads
- **Activity Tracking**: All interactions logged as CRM activities
- **Watchlist Notes**: Watchlists saved as CRM notes
- **Bulk Sync**: Daily automated sync of active users

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/pnpm
- MongoDB instance (local or cloud)
- Zoho Account (for Cliq/SalesIQ/CRM)
- API Keys: TMDB, YouTube, Spotify

### 1. Clone and Install

```bash
cd VibeVerse
cd server
npm install
# or
pnpm install
```

### 2. Configure Environment

Copy the template and fill in your credentials:

```bash
cp .env.template .env
```

Edit `.env` with your API keys and settings:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/vibeverse

# APIs
TMDB_API_KEY=your_tmdb_key
YOUTUBE_API_KEY=your_youtube_key
SPOTIFY_CLIENT_ID=your_spotify_id
SPOTIFY_CLIENT_SECRET=your_spotify_secret

# Zoho Cliq
ENABLE_CLIQ_BOT=true
CLIQ_WEBHOOK_SECRET=your_secret

# Zoho SalesIQ
ENABLE_SALESIQ_BOT=true

# Zoho CRM
ZOHO_CRM_ACCESS_TOKEN=your_token
ZOHO_CRM_REFRESH_TOKEN=your_refresh_token
ZOHO_CRM_CLIENT_ID=your_client_id
ZOHO_CRM_CLIENT_SECRET=your_client_secret

# Features
ENABLE_SCHEDULER=true
ENABLE_AUTO_CRM_SYNC=true
```

### 3. Start the Server

```bash
npm start
# or for development
npm run dev
```

Server will start on `http://localhost:5000`

---

## 🔧 Zoho Cliq Extension Setup

### 1. Create Extension in Cliq

1. Go to **Zoho Cliq** → **Bots & Tools** → **Create Extension**
2. Upload `plugin-manifest.json` from the root directory
3. Configure webhook URL: `https://your-server.com/bot/webhook`

### 2. Install in Your Workspace

1. Test the extension in development mode
2. Publish to your organization
3. Install from the Cliq marketplace

### 3. Available Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/mood` | Select your current mood | `/mood happy` |
| `/recommend` | Get recommendations | `/recommend romantic movies` |
| `/watchlist` | Manage watchlist | `/watchlist add Inception` |
| `/history` | View mood history | `/history week` |
| `/trending` | Get trending content | `/trending action` |
| `/summary` | Weekly summary | `/summary` |
| `/filter` | Apply filters | `/filter genre comedy` |

---

## 💬 SalesIQ Bot Setup

### 1. Create Bot in SalesIQ

1. Go to **Zoho SalesIQ** → **Bots** → **Create Bot**
2. Import `salesiq-bot-config.json`
3. Configure webhook URL: `https://your-server.com/api/salesiq/{endpoint}`

### 2. Configure Intents

The bot includes pre-configured intents:
- **greeting**: Initial welcome
- **select_mood**: Mood selection with NLU
- **get_recommendations**: Smart recommendations
- **manage_watchlist**: Watchlist operations
- **view_history**: Historical data
- **get_trending**: Trending content
- **weekly_summary**: Weekly reports

### 3. Test the Bot

Use the SalesIQ bot tester or visit your website with the SalesIQ widget installed.

---

## 📊 Database Schema

### Collections

- **UserProfile**: User settings and preferences
- **MoodHistory**: Timestamped mood selections
- **Watchlist**: Personal movie/music watchlists
- **RecommendationHistory**: Past recommendations
- **UserInteraction**: All user activities
- **WeeklySummary**: Generated weekly reports
- **TrendingCache**: Cached trending data

---

## 🔗 API Endpoints

### Enhanced API v2 (`/api/v2`)

#### Trending
- `GET /trending/mood/:mood` - Mood-based trending
- `GET /trending/global` - Global trending

#### User Mood
- `POST /user/:userId/mood` - Save mood
- `GET /user/:userId/mood/history` - Get history
- `GET /user/:userId/mood/stats` - Get statistics

#### Watchlist
- `POST /user/:userId/watchlist` - Add item
- `GET /user/:userId/watchlist` - Get watchlist
- `DELETE /user/:userId/watchlist/:itemId` - Remove item
- `PUT /user/:userId/watchlist/:itemId/watched` - Mark watched
- `DELETE /user/:userId/watchlist` - Clear all

#### Recommendations
- `POST /recommendations` - Get recommendations
- `GET /user/:userId/recommendations/history` - History

#### Summary
- `GET /user/:userId/summary/weekly` - Get summary
- `POST /user/:userId/summary/generate` - Generate new

#### Preferences
- `GET /user/:userId/preferences` - Get preferences
- `PUT /user/:userId/preferences` - Update preferences

#### CRM Sync
- `POST /crm/sync/user/:userId` - Sync user to CRM
- `POST /crm/sync/bulk` - Bulk sync

#### Analytics
- `GET /analytics/mood-trends` - Global mood trends

---

## ⏰ Scheduled Jobs

### Weekly Summaries
- **Schedule**: Every Monday at 9:00 AM
- **Action**: Generate summaries for all active users
- **Notification**: Send via Cliq/Email

### Daily CRM Sync
- **Schedule**: Every day at midnight
- **Action**: Sync active users to CRM
- **Limit**: 100 users per run

### Trending Cache Refresh
- **Schedule**: Every 30 minutes
- **Action**: Update trending cache for popular moods

### Data Cleanup
- **Schedule**: Every Sunday at 2:00 AM
- **Action**: Remove old data (6 months+ for moods, 3 months+ for interactions)

### Manual Trigger

```bash
# Via API
POST /api/v2/scheduler/trigger
{
  "job": "weekly-summaries"
}
```

---

## 🔐 Zoho CRM Integration

### Auto-sync Features

1. **User Profiles → Leads**: Automatic lead creation
2. **Mood History**: Synced in lead description
3. **Watchlist**: Added as CRM notes
4. **Recommendations**: Logged as activities

### CRM Fields

Custom fields needed in Leads:
- `VibeVerse_User_ID` (Text)
- `Last_Mood` (Text)
- `Total_Interactions` (Number)
- `Favorite_Genres` (Text)
- `Content_Preference` (Picklist: movies/music/both)

### Manual Sync

```bash
# Sync single user
POST /api/v2/crm/sync/user/:userId

# Bulk sync
POST /api/v2/crm/sync/bulk
{
  "userIds": ["user1", "user2", "user3"]
}
```

---

## 🎨 Customization

### Add New Moods

Edit `config.js` and add to `MOOD_MAPPINGS`:

```javascript
'YourMood': { 
    genres: [genre_ids],
    color: '#hexcolor',
    gradient: 'linear-gradient(...)',
    quote: "Your poetic quote",
    aura: 'radial-gradient(...)',
    musicKeywords: 'keywords for music search'
}
```

### Customize Bot Responses

Edit files:
- `server/cliq-bot-handler.js` - Cliq bot responses
- `server/salesiq-handler.js` - SalesIQ bot responses
- `salesiq-bot-config.json` - SalesIQ intents and training phrases

### Add New Commands

1. Add to `plugin-manifest.json` commands array
2. Implement handler in `cliq-bot-handler.js`
3. Add route in `setupRoutes()` method

---

## 🧪 Testing

### Health Check

```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "ok": true,
  "services": {
    "cliqBot": true,
    "salesiqBot": true,
    "database": true,
    "scheduler": true,
    "crm": true
  }
}
```

### Test Bot Locally

Use tools like Postman to test webhook endpoints:

```bash
# Test Cliq mood command
POST http://localhost:5000/bot/webhook
{
  "command": "/mood",
  "arguments": ["happy"],
  "user": {
    "id": "test-user",
    "name": "Test User"
  }
}
```

---

## 📦 Deployment

### Docker Deployment

```bash
docker-compose up -d
```

### Cloud Deployment

Deploy to:
- **Heroku**: `git push heroku master`
- **AWS**: Use Elastic Beanstalk or ECS
- **Azure**: App Service or Container Instances
- **Zoho Catalyst**: Native Zoho cloud platform

### Environment Variables

Set all required environment variables in your cloud platform's configuration.

---

## 🛠️ Troubleshooting

### Database Connection Issues

```bash
# Check MongoDB status
mongosh
show dbs
```

### Webhook Not Working

1. Verify webhook URL is publicly accessible
2. Check firewall settings
3. Validate webhook secret in `.env`
4. Check server logs for errors

### CRM Sync Failing

1. Verify CRM tokens are valid
2. Check token refresh logic
3. Ensure custom fields exist in CRM
4. Verify API permissions

---

## 📈 Performance Tips

1. **Enable Redis**: For better caching performance
2. **Database Indexing**: Already configured in models
3. **Rate Limiting**: Adjust limits in `server/index.js`
4. **Cache TTL**: Adjust cache duration for your needs

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🆘 Support

- **Issues**: Create an issue on GitHub
- **Email**: support@vibeverse.app
- **Zoho Community**: Post in Zoho Developer forums

---

## 🎯 Roadmap

- [ ] Multi-language support
- [ ] Voice command integration
- [ ] Social sharing features
- [ ] Group watchlist collaboration
- [ ] AI-powered mood detection
- [ ] Integration with more streaming platforms

---

## 📸 Screenshots

### Cliq Bot in Action
![Cliq Bot](docs/images/cliq-bot.png)

### SalesIQ Conversation
![SalesIQ Bot](docs/images/salesiq-bot.png)

### CRM Integration
![CRM Sync](docs/images/crm-integration.png)

---

**Made with ❤️ by the VibeVerse Team**

*Your Mood. Your Movie. Your Vibe.*
