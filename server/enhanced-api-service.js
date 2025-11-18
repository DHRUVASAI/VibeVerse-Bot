const express = require('express');
const DatabaseService = require('./database-service');
const ZohoCRMService = require('./zoho-crm-service');
const fetch = require('node-fetch');

class EnhancedAPIService {
  constructor(config) {
    this.config = config;
    this.db = new DatabaseService();
    this.crm = config.crmEnabled ? new ZohoCRMService(config.crm) : null;
    this.router = express.Router();
    this.setupRoutes();
  }

  setupRoutes() {
    // Trending endpoints
    this.router.get('/trending/mood/:mood', this.getTrendingByMood.bind(this));
    this.router.get('/trending/global', this.getGlobalTrending.bind(this));

    // User mood history
    this.router.post('/user/:userId/mood', this.saveMoodHistory.bind(this));
    this.router.get('/user/:userId/mood/history', this.getMoodHistory.bind(this));
    this.router.get('/user/:userId/mood/stats', this.getMoodStats.bind(this));

    // Watchlist management
    this.router.post('/user/:userId/watchlist', this.addToWatchlist.bind(this));
    this.router.get('/user/:userId/watchlist', this.getWatchlist.bind(this));
    this.router.delete('/user/:userId/watchlist/:itemId', this.removeFromWatchlist.bind(this));
    this.router.put('/user/:userId/watchlist/:itemId/watched', this.markAsWatched.bind(this));
    this.router.delete('/user/:userId/watchlist', this.clearWatchlist.bind(this));

    // Recommendations
    this.router.post('/recommendations', this.getRecommendations.bind(this));
    this.router.get('/user/:userId/recommendations/history', this.getRecommendationHistory.bind(this));

    // Weekly summary
    this.router.get('/user/:userId/summary/weekly', this.getWeeklySummary.bind(this));
    this.router.post('/user/:userId/summary/generate', this.generateWeeklySummary.bind(this));

    // User preferences
    this.router.get('/user/:userId/preferences', this.getUserPreferences.bind(this));
    this.router.put('/user/:userId/preferences', this.updateUserPreferences.bind(this));

    // CRM sync endpoints
    if (this.crm) {
      this.router.post('/crm/sync/user/:userId', this.syncUserToCRM.bind(this));
      this.router.post('/crm/sync/bulk', this.bulkSyncToCRM.bind(this));
    }

    // Analytics
    this.router.get('/analytics/mood-trends', this.getGlobalMoodTrends.bind(this));
  }

  // Trending by mood
  async getTrendingByMood(req, res) {
    try {
      const { mood } = req.params;
      const { contentType = 'movies', limit = 20 } = req.query;

      // Check cache first
      let cached = await this.db.getTrendingCache(mood, contentType);
      if (cached) {
        return res.json({ source: 'cache', data: cached });
      }

      // Fetch fresh data
      let trendingData;
      if (contentType === 'movies') {
        trendingData = await this.fetchTrendingMovies(mood, limit);
      } else if (contentType === 'tv') {
        trendingData = await this.fetchTrendingTV(mood, limit);
      } else if (contentType === 'music') {
        trendingData = await this.fetchTrendingMusic(mood, limit);
      }

      // Cache for 1 hour
      await this.db.setTrendingCache(mood, contentType, trendingData, 60);

      res.json({ source: 'fresh', data: trendingData });
    } catch (error) {
      console.error('Error getting trending:', error);
      res.status(500).json({ error: 'Failed to fetch trending content' });
    }
  }

  async fetchTrendingMovies(mood, limit) {
    try {
      const moodGenres = this.getMoodGenres(mood);
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${this.config.tmdbApiKey}`
      );
      const data = await response.json();

      // Filter by mood genres
      const filtered = data.results.filter(movie => 
        movie.genre_ids && movie.genre_ids.some(id => moodGenres.includes(id))
      );

      return filtered.slice(0, limit);
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      throw error;
    }
  }

  async fetchTrendingTV(mood, limit) {
    try {
      const moodGenres = this.getMoodGenres(mood);
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/tv/week?api_key=${this.config.tmdbApiKey}`
      );
      const data = await response.json();

      const filtered = data.results.filter(show => 
        show.genre_ids && show.genre_ids.some(id => moodGenres.includes(id))
      );

      return filtered.slice(0, limit);
    } catch (error) {
      console.error('Error fetching trending TV:', error);
      throw error;
    }
  }

  async fetchTrendingMusic(mood, limit) {
    // Implement Spotify trending music fetch
    // This is a placeholder - actual implementation would use Spotify API
    return [];
  }

  // Global trending (all moods)
  async getGlobalTrending(req, res) {
    try {
      const { contentType = 'movies', limit = 20 } = req.query;

      const url = contentType === 'movies'
        ? `https://api.themoviedb.org/3/trending/movie/week?api_key=${this.config.tmdbApiKey}`
        : `https://api.themoviedb.org/3/trending/tv/week?api_key=${this.config.tmdbApiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      res.json({ data: data.results.slice(0, limit) });
    } catch (error) {
      console.error('Error getting global trending:', error);
      res.status(500).json({ error: 'Failed to fetch trending content' });
    }
  }

  // Mood history endpoints
  async saveMoodHistory(req, res) {
    try {
      const { userId } = req.params;
      const { mood, context } = req.body;

      const entry = await this.db.saveMoodHistory(userId, mood, context);

      // Sync to CRM if enabled
      if (this.crm) {
        this.syncMoodToCRM(userId, mood).catch(err => 
          console.error('CRM sync error:', err)
        );
      }

      res.json({ success: true, entry });
    } catch (error) {
      console.error('Error saving mood:', error);
      res.status(500).json({ error: 'Failed to save mood history' });
    }
  }

  async getMoodHistory(req, res) {
    try {
      const { userId } = req.params;
      const { period = 'week' } = req.query;

      const history = await this.db.getMoodHistory(userId, period);
      res.json({ history });
    } catch (error) {
      console.error('Error getting mood history:', error);
      res.status(500).json({ error: 'Failed to fetch mood history' });
    }
  }

  async getMoodStats(req, res) {
    try {
      const { userId } = req.params;
      const { period = 'week' } = req.query;

      const stats = await this.db.getMoodStats(userId, period);
      res.json({ stats });
    } catch (error) {
      console.error('Error getting mood stats:', error);
      res.status(500).json({ error: 'Failed to fetch mood stats' });
    }
  }

  // Watchlist endpoints
  async addToWatchlist(req, res) {
    try {
      const { userId } = req.params;
      const item = req.body;

      const watchlist = await this.db.addToWatchlist(userId, item);

      // Sync to CRM if enabled
      if (this.crm) {
        this.syncWatchlistToCRM(userId).catch(err => 
          console.error('CRM sync error:', err)
        );
      }

      res.json({ success: true, watchlist });
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      res.status(500).json({ error: 'Failed to add to watchlist' });
    }
  }

  async getWatchlist(req, res) {
    try {
      const { userId } = req.params;
      const filter = req.query;

      const watchlist = await this.db.getWatchlist(userId, filter);
      res.json({ watchlist });
    } catch (error) {
      console.error('Error getting watchlist:', error);
      res.status(500).json({ error: 'Failed to fetch watchlist' });
    }
  }

  async removeFromWatchlist(req, res) {
    try {
      const { userId, itemId } = req.params;

      const watchlist = await this.db.removeFromWatchlist(userId, itemId);
      res.json({ success: true, watchlist });
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      res.status(500).json({ error: 'Failed to remove from watchlist' });
    }
  }

  async markAsWatched(req, res) {
    try {
      const { userId, itemId } = req.params;
      const { rating, notes } = req.body;

      const watchlist = await this.db.markAsWatched(userId, itemId, rating, notes);
      res.json({ success: true, watchlist });
    } catch (error) {
      console.error('Error marking as watched:', error);
      res.status(500).json({ error: 'Failed to mark as watched' });
    }
  }

  async clearWatchlist(req, res) {
    try {
      const { userId } = req.params;

      const watchlist = await this.db.clearWatchlist(userId);
      res.json({ success: true, watchlist });
    } catch (error) {
      console.error('Error clearing watchlist:', error);
      res.status(500).json({ error: 'Failed to clear watchlist' });
    }
  }

  // Recommendations
  async getRecommendations(req, res) {
    try {
      const { userId, mood, contentType = 'both', filters = {} } = req.body;

      // This would integrate with existing TMDB/Spotify logic
      // Placeholder implementation
      const recommendations = {
        movies: [],
        music: []
      };

      // Save recommendation history
      await this.db.saveRecommendation(userId, mood, contentType, recommendations, filters);

      res.json({ recommendations });
    } catch (error) {
      console.error('Error getting recommendations:', error);
      res.status(500).json({ error: 'Failed to get recommendations' });
    }
  }

  async getRecommendationHistory(req, res) {
    try {
      const { userId } = req.params;
      const { limit = 10 } = req.query;

      const history = await this.db.getRecommendationHistory(userId, limit);
      res.json({ history });
    } catch (error) {
      console.error('Error getting recommendation history:', error);
      res.status(500).json({ error: 'Failed to fetch recommendation history' });
    }
  }

  // Weekly summary
  async getWeeklySummary(req, res) {
    try {
      const { userId } = req.params;

      let summary = await this.db.getWeeklySummary(userId);
      
      if (!summary) {
        summary = await this.db.generateWeeklySummary(userId);
      }

      res.json({ summary });
    } catch (error) {
      console.error('Error getting weekly summary:', error);
      res.status(500).json({ error: 'Failed to fetch weekly summary' });
    }
  }

  async generateWeeklySummary(req, res) {
    try {
      const { userId } = req.params;

      const summary = await this.db.generateWeeklySummary(userId);
      res.json({ summary });
    } catch (error) {
      console.error('Error generating weekly summary:', error);
      res.status(500).json({ error: 'Failed to generate weekly summary' });
    }
  }

  // User preferences
  async getUserPreferences(req, res) {
    try {
      const { userId } = req.params;

      const profile = await this.db.getUserProfile(userId);
      res.json({ preferences: profile.preferences });
    } catch (error) {
      console.error('Error getting user preferences:', error);
      res.status(500).json({ error: 'Failed to fetch user preferences' });
    }
  }

  async updateUserPreferences(req, res) {
    try {
      const { userId } = req.params;
      const { preferences } = req.body;

      const profile = await this.db.updateUserPreferences(userId, preferences);
      res.json({ success: true, preferences: profile.preferences });
    } catch (error) {
      console.error('Error updating user preferences:', error);
      res.status(500).json({ error: 'Failed to update user preferences' });
    }
  }

  // CRM sync
  async syncUserToCRM(req, res) {
    try {
      if (!this.crm) {
        return res.status(400).json({ error: 'CRM integration not enabled' });
      }

      const { userId } = req.params;

      const profile = await this.db.getUserProfile(userId);
      const moodHistory = await this.db.getMoodHistory(userId, 'month');
      const interactions = await this.db.getUserInteractions(userId, 'month');

      const result = await this.crm.syncUserToLead(profile, moodHistory, interactions);

      res.json({ success: true, result });
    } catch (error) {
      console.error('Error syncing to CRM:', error);
      res.status(500).json({ error: 'Failed to sync to CRM' });
    }
  }

  async bulkSyncToCRM(req, res) {
    try {
      if (!this.crm) {
        return res.status(400).json({ error: 'CRM integration not enabled' });
      }

      const { userIds } = req.body;

      // Prepare user data
      const users = await Promise.all(userIds.map(async userId => {
        const profile = await this.db.getUserProfile(userId);
        const moodHistory = await this.db.getMoodHistory(userId, 'month');
        const interactions = await this.db.getUserInteractions(userId, 'month');
        return { profile, moodHistory, interactions };
      }));

      const results = await this.crm.bulkSyncUsers(users);

      res.json({ success: true, results });
    } catch (error) {
      console.error('Error bulk syncing to CRM:', error);
      res.status(500).json({ error: 'Failed to bulk sync to CRM' });
    }
  }

  // Analytics
  async getGlobalMoodTrends(req, res) {
    try {
      const { period = 'week' } = req.query;

      const trends = await this.db.getGlobalMoodTrends(period);
      res.json({ trends });
    } catch (error) {
      console.error('Error getting mood trends:', error);
      res.status(500).json({ error: 'Failed to fetch mood trends' });
    }
  }

  // Helper methods
  async syncMoodToCRM(userId, mood) {
    if (!this.crm) return;

    try {
      const profile = await this.db.getUserProfile(userId);
      const moodHistory = await this.db.getMoodHistory(userId, 'week');
      const interactions = await this.db.getUserInteractions(userId, 'week');

      await this.crm.syncUserToLead(profile, moodHistory, interactions);
    } catch (error) {
      console.error('Error syncing mood to CRM:', error);
    }
  }

  async syncWatchlistToCRM(userId) {
    if (!this.crm) return;

    try {
      const watchlist = await this.db.getWatchlist(userId);
      await this.crm.syncWatchlist(userId, watchlist);
    } catch (error) {
      console.error('Error syncing watchlist to CRM:', error);
    }
  }

  getMoodGenres(mood) {
    const moodGenreMap = {
      happy: [35, 10751], // Comedy, Family
      romantic: [10749, 18], // Romance, Drama
      sad: [18, 10749], // Drama, Romance
      thriller: [53, 9648], // Thriller, Mystery
      action: [28, 12], // Action, Adventure
      comedy: [35], // Comedy
      horror: [27], // Horror
      drama: [18], // Drama
      adventure: [12, 14], // Adventure, Fantasy
      mystery: [9648], // Mystery
      'sci-fi': [878], // Science Fiction
      fantasy: [14], // Fantasy
      animated: [16], // Animation
    };

    return moodGenreMap[mood.toLowerCase()] || [];
  }
}

module.exports = EnhancedAPIService;
