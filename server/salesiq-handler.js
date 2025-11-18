const express = require('express');
const DatabaseService = require('./database-service');

class SalesIQHandler {
  constructor(config) {
    this.config = config;
    this.db = new DatabaseService();
    this.router = express.Router();
    this.setupRoutes();
  }

  setupRoutes() {
    // SalesIQ webhook endpoints
    this.router.post('/salesiq/mood', this.handleMood.bind(this));
    this.router.post('/salesiq/recommend', this.handleRecommend.bind(this));
    this.router.post('/salesiq/watchlist', this.handleWatchlist.bind(this));
    this.router.post('/salesiq/history', this.handleHistory.bind(this));
    this.router.post('/salesiq/trending', this.handleTrending.bind(this));
    this.router.post('/salesiq/summary', this.handleSummary.bind(this));
  }

  async handleMood(req, res) {
    try {
      const { visitor, parameters } = req.body;
      const userId = visitor.id || visitor.email;
      const mood = parameters.mood;

      if (!mood) {
        return res.json({
          replies: [{
            type: 'text',
            text: 'Please tell me your mood! Try: happy, sad, romantic, thriller, action, comedy, or any other mood you\'re in.'
          }]
        });
      }

      // Save mood history
      await this.db.saveMoodHistory(userId, mood, {
        source: 'salesiq',
        command: 'mood_selection'
      });

      // Get mood stats
      const stats = await this.db.getMoodStats(userId, 'week');

      const response = {
        replies: [
          {
            type: 'text',
            text: `${this.getMoodEmoji(mood)} Great! I see you're feeling ${mood} today.`
          },
          {
            type: 'card',
            title: `${mood.charAt(0).toUpperCase() + mood.slice(1)} Vibes`,
            description: this.getMoodDescription(mood),
            image: this.getMoodImage(mood),
            buttons: [
              {
                label: '🎬 Get Movie Recommendations',
                action: 'recommend',
                payload: { mood, contentType: 'movies' }
              },
              {
                label: '🎵 Get Music Recommendations',
                action: 'recommend',
                payload: { mood, contentType: 'music' }
              },
              {
                label: '🎭 Get Both',
                action: 'recommend',
                payload: { mood, contentType: 'both' }
              }
            ]
          }
        ]
      };

      if (stats.topMood && stats.topMood !== mood) {
        response.replies.push({
          type: 'text',
          text: `💡 Fun fact: Your most common mood this week has been "${stats.topMood}"!`
        });
      }

      res.json(response);
    } catch (error) {
      console.error('Error handling mood:', error);
      res.json({
        replies: [{
          type: 'text',
          text: '⚠️ Sorry, I encountered an error. Please try again!'
        }]
      });
    }
  }

  async handleRecommend(req, res) {
    try {
      const { visitor, parameters } = req.body;
      const userId = visitor.id || visitor.email;
      const mood = parameters.mood || 'happy';
      const contentType = parameters.contentType || 'both';

      // Get recommendations (this would integrate with your existing recommendation logic)
      const recommendations = await this.getRecommendations(mood, contentType);

      // Save recommendation history
      await this.db.saveRecommendation(userId, mood, contentType, recommendations);

      const replies = [
        {
          type: 'text',
          text: `${this.getMoodEmoji(mood)} Here are your ${mood} recommendations!`
        }
      ];

      // Add movie cards
      if ((contentType === 'both' || contentType === 'movies') && recommendations.movies) {
        recommendations.movies.slice(0, 5).forEach(movie => {
          replies.push({
            type: 'card',
            title: movie.title,
            description: `⭐ ${movie.rating || 'N/A'}/10 | ${movie.year || 'N/A'}\n\n${movie.overview?.substring(0, 150) || ''}...`,
            image: movie.posterUrl || '',
            buttons: [
              {
                label: '➕ Add to Watchlist',
                action: 'add_to_watchlist',
                payload: { movieId: movie.id, movieName: movie.title }
              },
              {
                label: '📖 More Info',
                action: 'movie_details',
                payload: { movieId: movie.id }
              }
            ]
          });
        });
      }

      // Add music section
      if ((contentType === 'both' || contentType === 'music') && recommendations.music) {
        const musicText = recommendations.music.slice(0, 5)
          .map((track, i) => `${i + 1}. 🎵 **${track.title}** by ${track.artist || 'Various Artists'}`)
          .join('\n');

        replies.push({
          type: 'text',
          text: `**Music Recommendations:**\n\n${musicText}`
        });
      }

      // Add action buttons
      replies.push({
        type: 'quick_replies',
        text: 'What would you like to do next?',
        buttons: [
          { label: '🔄 More Recommendations', action: 'recommend', payload: { mood, contentType } },
          { label: '📝 View Watchlist', action: 'watchlist', payload: { action: 'view' } },
          { label: '🎭 Change Mood', action: 'select_mood', payload: {} }
        ]
      });

      res.json({ replies });
    } catch (error) {
      console.error('Error handling recommend:', error);
      res.json({
        replies: [{
          type: 'text',
          text: '⚠️ Sorry, I couldn\'t get recommendations right now. Please try again!'
        }]
      });
    }
  }

  async handleWatchlist(req, res) {
    try {
      const { visitor, parameters } = req.body;
      const userId = visitor.id || visitor.email;
      const action = parameters.action || 'view';
      const movieName = parameters.movieName;

      switch (action) {
        case 'add':
          if (!movieName) {
            return res.json({
              replies: [{
                type: 'text',
                text: '⚠️ Please specify a movie name to add to your watchlist.'
              }]
            });
          }

          await this.db.addToWatchlist(userId, {
            type: 'movie',
            title: movieName,
            metadata: {}
          });

          return res.json({
            replies: [
              {
                type: 'text',
                text: `✅ Added "${movieName}" to your watchlist!`
              },
              {
                type: 'quick_replies',
                text: 'What next?',
                buttons: [
                  { label: '📝 View Watchlist', action: 'watchlist', payload: { action: 'view' } },
                  { label: '🎬 More Recommendations', action: 'recommend', payload: {} }
                ]
              }
            ]
          });

        case 'clear':
          await this.db.clearWatchlist(userId);
          return res.json({
            replies: [{
              type: 'text',
              text: '🗑️ Your watchlist has been cleared!'
            }]
          });

        case 'view':
        default:
          const watchlist = await this.db.getWatchlist(userId);
          
          if (!watchlist.items || watchlist.items.length === 0) {
            return res.json({
              replies: [{
                type: 'text',
                text: '📝 Your watchlist is empty. Start adding movies to keep track of what you want to watch!'
              }]
            });
          }

          const watchlistText = watchlist.items
            .map((item, i) => {
              const status = item.watched ? '✅' : '⏳';
              return `${status} ${i + 1}. **${item.title}**${item.metadata?.year ? ` (${item.metadata.year})` : ''}`;
            })
            .join('\n');

          return res.json({
            replies: [
              {
                type: 'text',
                text: `📝 **Your Watchlist** (${watchlist.items.length} items)\n\n${watchlistText}`
              },
              {
                type: 'quick_replies',
                text: 'Manage your watchlist:',
                buttons: [
                  { label: '🗑️ Clear Watchlist', action: 'watchlist', payload: { action: 'clear' } },
                  { label: '🎬 Get More Recommendations', action: 'recommend', payload: {} }
                ]
              }
            ]
          });
      }
    } catch (error) {
      console.error('Error handling watchlist:', error);
      res.json({
        replies: [{
          type: 'text',
          text: '⚠️ Sorry, I couldn\'t access your watchlist. Please try again!'
        }]
      });
    }
  }

  async handleHistory(req, res) {
    try {
      const { visitor, parameters } = req.body;
      const userId = visitor.id || visitor.email;
      const period = parameters.period || 'week';

      const stats = await this.db.getMoodStats(userId, period);

      if (stats.totalEntries === 0) {
        return res.json({
          replies: [{
            type: 'text',
            text: '📊 You haven\'t selected any moods yet. Start exploring to build your history!'
          }]
        });
      }

      const moodBreakdown = Object.entries(stats.moodCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([mood, count]) => `${this.getMoodEmoji(mood)} ${mood}: ${count}x`)
        .join('\n');

      res.json({
        replies: [
          {
            type: 'text',
            text: `📊 **Your Mood History** (Past ${period})\n\n**Top Mood:** ${this.getMoodEmoji(stats.topMood)} ${stats.topMood}\n**Total Selections:** ${stats.totalEntries}\n\n**Breakdown:**\n${moodBreakdown}`
          },
          {
            type: 'quick_replies',
            text: 'What would you like to do?',
            buttons: [
              { label: '📅 Weekly Summary', action: 'summary', payload: {} },
              { label: '🎬 Get Recommendations', action: 'recommend', payload: {} },
              { label: '📝 View Watchlist', action: 'watchlist', payload: { action: 'view' } }
            ]
          }
        ]
      });
    } catch (error) {
      console.error('Error handling history:', error);
      res.json({
        replies: [{
          type: 'text',
          text: '⚠️ Sorry, I couldn\'t retrieve your history. Please try again!'
        }]
      });
    }
  }

  async handleTrending(req, res) {
    try {
      const { parameters } = req.body;
      const mood = parameters.mood;

      let trendingData;
      if (mood) {
        trendingData = await this.db.getTrendingCache(mood, 'movies');
        if (!trendingData) {
          // Fetch fresh if not cached
          trendingData = []; // Would fetch from TMDB trending API
        }
      } else {
        // Global trending
        trendingData = []; // Would fetch global trending
      }

      const trendingText = trendingData.slice(0, 10)
        .map((movie, i) => `${i + 1}. 🔥 **${movie.title}** ⭐ ${movie.vote_average || 'N/A'}/10`)
        .join('\n');

      res.json({
        replies: [
          {
            type: 'text',
            text: mood 
              ? `🔥 **Trending ${mood.charAt(0).toUpperCase() + mood.slice(1)} Movies**\n\n${trendingText || 'No trending data available.'}`
              : `🔥 **Trending Movies This Week**\n\n${trendingText || 'No trending data available.'}`
          },
          {
            type: 'quick_replies',
            text: 'Want to explore more?',
            buttons: [
              { label: '🎬 Get Recommendations', action: 'recommend', payload: { mood: mood || 'happy' } },
              { label: '📝 View Watchlist', action: 'watchlist', payload: { action: 'view' } }
            ]
          }
        ]
      });
    } catch (error) {
      console.error('Error handling trending:', error);
      res.json({
        replies: [{
          type: 'text',
          text: '⚠️ Sorry, I couldn\'t get trending content right now. Please try again!'
        }]
      });
    }
  }

  async handleSummary(req, res) {
    try {
      const { visitor } = req.body;
      const userId = visitor.id || visitor.email;

      let summary = await this.db.getWeeklySummary(userId);
      
      if (!summary) {
        summary = await this.db.generateWeeklySummary(userId);
      }

      if (!summary || !summary.stats) {
        return res.json({
          replies: [{
            type: 'text',
            text: '📅 You don\'t have enough activity yet to generate a weekly summary. Keep exploring!'
          }]
        });
      }

      const { stats } = summary;

      res.json({
        replies: [
          {
            type: 'card',
            title: '📅 Your Weekly VibeVerse Summary',
            description: `**Top Mood:** ${this.getMoodEmoji(stats.topMood)} ${stats.topMood}\n**Movies Added:** ${stats.moviesAdded || 0}\n**Movies Watched:** ${stats.moviesWatched || 0}\n**Recommendations:** ${stats.totalRecommendations || 0}\n**Total Interactions:** ${stats.totalInteractions || 0}`,
            image: 'https://public-frontend-cos.metadl.com/mgx/img/favicon.png'
          },
          {
            type: 'quick_replies',
            text: 'What would you like to do next?',
            buttons: [
              { label: '🎬 Get Recommendations', action: 'recommend', payload: { mood: stats.topMood } },
              { label: '📊 View Full History', action: 'history', payload: {} },
              { label: '📝 View Watchlist', action: 'watchlist', payload: { action: 'view' } }
            ]
          }
        ]
      });
    } catch (error) {
      console.error('Error handling summary:', error);
      res.json({
        replies: [{
          type: 'text',
          text: '⚠️ Sorry, I couldn\'t generate your summary. Please try again!'
        }]
      });
    }
  }

  // Helper methods
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
      fantasy: '🧙'
    };
    return emojiMap[mood?.toLowerCase()] || '🎬';
  }

  getMoodDescription(mood) {
    const descriptions = {
      happy: 'Feel-good movies and uplifting music to keep you smiling!',
      romantic: 'Love stories and romantic ballads for the heart.',
      sad: 'Emotional journeys and soulful music to match your mood.',
      thriller: 'Edge-of-your-seat suspense and intense soundtracks.',
      action: 'High-octane entertainment and energetic beats.',
      comedy: 'Laughter and fun tunes to brighten your day.',
      drama: 'Deep, emotional stories that touch the soul.',
      adventure: 'Epic journeys and adventurous soundscapes.'
    };
    return descriptions[mood?.toLowerCase()] || 'Discover amazing content for your mood!';
  }

  getMoodImage(mood) {
    // Return mood-specific images (placeholder URLs)
    return 'https://public-frontend-cos.metadl.com/mgx/img/favicon.png';
  }

  async getRecommendations(mood, contentType) {
    // Placeholder - integrate with your existing recommendation logic
    return {
      movies: [],
      music: []
    };
  }
}

module.exports = SalesIQHandler;
