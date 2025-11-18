const express = require('express');
const crypto = require('crypto');

class CliqBotHandler {
  constructor(config) {
    this.config = config;
    this.router = express.Router();
    this.setupRoutes();
  }

  setupRoutes() {
    // Main webhook endpoint for Cliq
    this.router.post('/webhook', async (req, res) => {
      try {
        const { type, command, user, arguments: args } = req.body;

        console.log('📥 Received Cliq webhook:', { type, command, user: user?.name });

        // Verify webhook signature if configured
        if (this.config.cliqWebhookSecret) {
          const signature = req.headers['x-cliq-signature'];
          if (!this.verifySignature(req.body, signature)) {
            return res.status(403).json({ error: 'Invalid signature' });
          }
        }

        // Route to appropriate handler
        let response;
        switch (command) {
          case '/mood':
            response = await this.handleMoodCommand(user, args);
            break;
          case '/recommend':
            response = await this.handleRecommendCommand(user, args);
            break;
          case '/watchlist':
            response = await this.handleWatchlistCommand(user, args);
            break;
          case '/history':
            response = await this.handleHistoryCommand(user, args);
            break;
          case '/trending':
            response = await this.handleTrendingCommand(user, args);
            break;
          case '/summary':
            response = await this.handleSummaryCommand(user, args);
            break;
          case '/filter':
            response = await this.handleFilterCommand(user, args);
            break;
          default:
            response = this.handleDefaultMessage(user);
        }

        res.json(response);
      } catch (error) {
        console.error('❌ Webhook error:', error);
        res.status(500).json({
          text: '⚠️ Sorry, something went wrong. Please try again later.'
        });
      }
    });

    // Action handler for button clicks
    this.router.post('/action', async (req, res) => {
      try {
        const { action_name, user, data } = req.body;
        console.log('🔘 Action received:', action_name);

        let response;
        switch (action_name) {
          case 'select_mood':
            response = await this.handleMoodSelection(user, data);
            break;
          case 'add_to_watchlist':
            response = await this.handleAddToWatchlist(user, data);
            break;
          case 'get_more_recommendations':
            response = await this.handleMoreRecommendations(user, data);
            break;
          default:
            response = { text: 'Unknown action' };
        }

        res.json(response);
      } catch (error) {
        console.error('❌ Action error:', error);
        res.status(500).json({ text: 'Error processing action' });
      }
    });
  }

  // Command Handlers
  async handleMoodCommand(user, args) {
    const mood = args && args[0] ? args[0].toLowerCase() : null;

    if (!mood) {
      return this.createMoodSelectionCard(user);
    }

    // Save mood to history
    await this.saveMoodHistory(user.id, mood);

    // Get recommendations
    const recommendations = await this.getRecommendationsByMood(mood);

    return this.createRecommendationCard(user, mood, recommendations);
  }

  async handleRecommendCommand(user, args) {
    const mood = args && args[0] ? args[0].toLowerCase() : 'happy';
    const contentType = args && args[1] ? args[1].toLowerCase() : 'both';

    await this.saveMoodHistory(user.id, mood);

    const recommendations = await this.getRecommendationsByMood(mood, contentType);

    return this.createRecommendationCard(user, mood, recommendations, contentType);
  }

  async handleWatchlistCommand(user, args) {
    const action = args && args[0] ? args[0].toLowerCase() : 'view';
    const movieName = args && args.slice(1).join(' ');

    switch (action) {
      case 'add':
        if (!movieName) {
          return { text: '⚠️ Please specify a movie name. Usage: /watchlist add <movie name>' };
        }
        await this.addToWatchlist(user.id, movieName);
        return {
          text: `✅ Added "${movieName}" to your watchlist!`,
          card: this.createWatchlistCard(user)
        };

      case 'clear':
        await this.clearWatchlist(user.id);
        return { text: '🗑️ Your watchlist has been cleared!' };

      case 'view':
      default:
        return this.createWatchlistCard(user);
    }
  }

  async handleHistoryCommand(user, args) {
    const period = args && args[0] ? args[0].toLowerCase() : 'week';
    const history = await this.getMoodHistory(user.id, period);

    return this.createHistoryCard(user, history, period);
  }

  async handleTrendingCommand(user, args) {
    const mood = args && args[0] ? args[0].toLowerCase() : null;

    if (!mood) {
      return {
        text: '⚠️ Please specify a mood. Usage: /trending <mood>\nExample: /trending happy'
      };
    }

    const trending = await this.getTrendingByMood(mood);
    return this.createTrendingCard(user, mood, trending);
  }

  async handleSummaryCommand(user, args) {
    const summary = await this.generateWeeklySummary(user.id);
    return this.createSummaryCard(user, summary);
  }

  async handleFilterCommand(user, args) {
    const filterType = args && args[0] ? args[0].toLowerCase() : null;
    const filterValue = args && args[1] ? args[1].toLowerCase() : null;

    if (!filterType || !filterValue) {
      return {
        text: '⚠️ Please specify filter type and value.\nUsage: /filter <type> <value>\nExample: /filter genre comedy'
      };
    }

    // Save user preferences
    await this.saveUserFilter(user.id, filterType, filterValue);

    return {
      text: `✅ Filter applied: ${filterType} = ${filterValue}\nUse /recommend to get filtered recommendations!`
    };
  }

  handleDefaultMessage(user) {
    return {
      text: `👋 Hey ${user.name || 'there'}! Welcome to VibeVerse!`,
      card: {
        title: '🎬 VibeVerse Bot',
        theme: 'modern-inline',
        thumbnail: 'https://public-frontend-cos.metadl.com/mgx/img/favicon.png',
        sections: [
          {
            id: 1,
            elements: [
              {
                type: 'text',
                text: '**Your Mood. Your Movie.** Get personalized movie and music recommendations based on your vibe!'
              },
              {
                type: 'divider'
              },
              {
                type: 'text',
                text: '**Available Commands:**'
              },
              {
                type: 'text',
                text: '🎭 `/mood [mood]` - Select your mood\n🎬 `/recommend [mood] [type]` - Get recommendations\n📝 `/watchlist [action]` - Manage watchlist\n📊 `/history [period]` - View mood history\n🔥 `/trending [mood]` - Trending content\n📅 `/summary` - Weekly summary\n🔍 `/filter [type] [value]` - Apply filters'
              }
            ]
          }
        ],
        buttons: [
          {
            label: '🎭 Select Mood',
            type: '+',
            action: {
              type: 'invoke.function',
              name: 'select_mood'
            }
          },
          {
            label: '🎬 Get Recommendations',
            type: '+',
            action: {
              type: 'invoke.function',
              name: 'get_recommendations'
            }
          }
        ]
      }
    };
  }

  // Card Creators
  createMoodSelectionCard(user) {
    const moods = [
      { emoji: '😊', name: 'Happy', color: '#ffcc00' },
      { emoji: '💕', name: 'Romantic', color: '#ec4899' },
      { emoji: '😢', name: 'Sad', color: '#6b7280' },
      { emoji: '😱', name: 'Thriller', color: '#8b5cf6' },
      { emoji: '💥', name: 'Action', color: '#ef4444' },
      { emoji: '😂', name: 'Comedy', color: '#f59e0b' },
      { emoji: '🎭', name: 'Drama', color: '#3b82f6' },
      { emoji: '🌍', name: 'Adventure', color: '#10b981' }
    ];

    return {
      text: `Hey ${user.name || 'there'}! How are you feeling today?`,
      card: {
        title: '🎭 Select Your Mood',
        theme: 'modern-inline',
        sections: [
          {
            id: 1,
            elements: moods.map(mood => ({
              type: 'button',
              label: `${mood.emoji} ${mood.name}`,
              action: {
                type: 'invoke.function',
                name: 'select_mood',
                data: { mood: mood.name.toLowerCase() }
              }
            }))
          }
        ]
      }
    };
  }

  createRecommendationCard(user, mood, recommendations, contentType = 'both') {
    const moodEmoji = this.getMoodEmoji(mood);
    
    const sections = [];

    // Movies section
    if ((contentType === 'both' || contentType === 'movies') && recommendations.movies) {
      sections.push({
        id: sections.length + 1,
        title: '🎬 Movie Recommendations',
        elements: recommendations.movies.slice(0, 5).map(movie => ({
          type: 'text',
          text: `**${movie.title}** (${movie.year || 'N/A'})\n⭐ ${movie.rating || 'N/A'}/10 | ${movie.genre || 'General'}\n${movie.overview ? movie.overview.substring(0, 100) + '...' : ''}`
        }))
      });
    }

    // Music section
    if ((contentType === 'both' || contentType === 'music') && recommendations.music) {
      sections.push({
        id: sections.length + 1,
        title: '🎵 Music Recommendations',
        elements: recommendations.music.slice(0, 5).map(track => ({
          type: 'text',
          text: `**${track.title}** by ${track.artist || 'Various Artists'}\n🎧 ${track.platform || 'Spotify'}`
        }))
      });
    }

    return {
      text: `${moodEmoji} Here are your ${mood} recommendations!`,
      card: {
        title: `${moodEmoji} ${mood.charAt(0).toUpperCase() + mood.slice(1)} Vibes`,
        theme: 'modern-inline',
        sections: sections,
        buttons: [
          {
            label: '➕ More Recommendations',
            type: '+',
            action: {
              type: 'invoke.function',
              name: 'get_more_recommendations',
              data: { mood, contentType }
            }
          },
          {
            label: '📝 View Watchlist',
            type: '+',
            action: {
              type: 'invoke.function',
              name: 'view_watchlist'
            }
          }
        ]
      }
    };
  }

  createWatchlistCard(user) {
    // This would fetch from database
    return {
      text: '📝 Your Watchlist',
      card: {
        title: '📝 Your Personal Watchlist',
        theme: 'modern-inline',
        sections: [
          {
            id: 1,
            elements: [
              {
                type: 'text',
                text: 'Use `/watchlist add <movie name>` to add movies!\nUse `/watchlist clear` to clear your list.'
              }
            ]
          }
        ]
      }
    };
  }

  createHistoryCard(user, history, period) {
    return {
      text: `📊 Your mood history for the past ${period}`,
      card: {
        title: `📊 Mood History - ${period}`,
        theme: 'modern-inline',
        sections: [
          {
            id: 1,
            elements: [
              {
                type: 'text',
                text: history && history.length > 0 
                  ? history.map(h => `${this.getMoodEmoji(h.mood)} ${h.mood} - ${new Date(h.timestamp).toLocaleDateString()}`).join('\n')
                  : 'No mood history found for this period.'
              }
            ]
          }
        ]
      }
    };
  }

  createTrendingCard(user, mood, trending) {
    return {
      text: `🔥 Trending ${mood} content`,
      card: {
        title: `🔥 Trending - ${mood.charAt(0).toUpperCase() + mood.slice(1)}`,
        theme: 'modern-inline',
        sections: [
          {
            id: 1,
            title: 'Top Trending Movies',
            elements: trending && trending.movies ? trending.movies.slice(0, 5).map(movie => ({
              type: 'text',
              text: `**${movie.title}** ⭐ ${movie.rating}/10`
            })) : []
          }
        ]
      }
    };
  }

  createSummaryCard(user, summary) {
    return {
      text: '📅 Your Weekly VibeVerse Summary',
      card: {
        title: '📅 Weekly Summary',
        theme: 'modern-inline',
        sections: [
          {
            id: 1,
            elements: [
              {
                type: 'text',
                text: `**Most Common Mood:** ${summary.topMood || 'N/A'}\n**Movies Watched:** ${summary.moviesWatched || 0}\n**Recommendations Received:** ${summary.recommendationsCount || 0}`
              }
            ]
          }
        ]
      }
    };
  }

  // Helper Methods
  getMoodEmoji(mood) {
    const emojiMap = {
      happy: '😊',
      romantic: '💕',
      sad: '😢',
      thriller: '😱',
      action: '💥',
      comedy: '😂',
      drama: '🎭',
      adventure: '🌍',
      horror: '👻',
      mystery: '🔍',
      'sci-fi': '🚀',
      fantasy: '🧙',
      animated: '🎨'
    };
    return emojiMap[mood.toLowerCase()] || '🎬';
  }

  verifySignature(payload, signature) {
    if (!this.config.cliqWebhookSecret) return true;
    const hmac = crypto.createHmac('sha256', this.config.cliqWebhookSecret);
    const digest = hmac.update(JSON.stringify(payload)).digest('hex');
    return digest === signature;
  }

  // Placeholder methods - to be implemented with database
  async saveMoodHistory(userId, mood) {
    // TODO: Implement database save
    console.log(`💾 Saving mood: ${mood} for user: ${userId}`);
  }

  async getRecommendationsByMood(mood, contentType = 'both') {
    // TODO: Implement actual API calls
    return {
      movies: [],
      music: []
    };
  }

  async addToWatchlist(userId, movieName) {
    // TODO: Implement database save
    console.log(`📝 Adding to watchlist: ${movieName} for user: ${userId}`);
  }

  async clearWatchlist(userId) {
    // TODO: Implement database clear
    console.log(`🗑️ Clearing watchlist for user: ${userId}`);
  }

  async getMoodHistory(userId, period) {
    // TODO: Implement database fetch
    return [];
  }

  async getTrendingByMood(mood) {
    // TODO: Implement trending API
    return { movies: [] };
  }

  async generateWeeklySummary(userId) {
    // TODO: Implement summary generation
    return { topMood: 'happy', moviesWatched: 0, recommendationsCount: 0 };
  }

  async saveUserFilter(userId, filterType, filterValue) {
    // TODO: Implement filter save
    console.log(`🔍 Saving filter: ${filterType}=${filterValue} for user: ${userId}`);
  }

  async handleMoodSelection(user, data) {
    return this.handleMoodCommand(user, [data.mood]);
  }

  async handleAddToWatchlist(user, data) {
    await this.addToWatchlist(user.id, data.movieName);
    return { text: `✅ Added "${data.movieName}" to your watchlist!` };
  }

  async handleMoreRecommendations(user, data) {
    return this.handleRecommendCommand(user, [data.mood, data.contentType]);
  }
}

module.exports = CliqBotHandler;
