const {
  UserProfile,
  MoodHistory,
  Watchlist,
  RecommendationHistory,
  UserInteraction,
  WeeklySummary,
  TrendingCache
} = require('./models');

class DatabaseService {
  // User Profile Methods
  async getUserProfile(userId) {
    try {
      let profile = await UserProfile.findOne({ userId });
      if (!profile) {
        profile = await UserProfile.create({
          userId,
          lastActive: new Date()
        });
      } else {
        profile.lastActive = new Date();
        await profile.save();
      }
      return profile;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  async updateUserPreferences(userId, preferences) {
    try {
      return await UserProfile.findOneAndUpdate(
        { userId },
        { $set: { preferences, lastActive: new Date() } },
        { new: true, upsert: true }
      );
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }

  // Mood History Methods
  async saveMoodHistory(userId, mood, context = {}) {
    try {
      const entry = await MoodHistory.create({
        userId,
        mood: mood.toLowerCase(),
        timestamp: new Date(),
        context
      });
      
      // Track interaction
      await this.trackInteraction(userId, 'mood_selection', { mood }, context.source || 'cliq');
      
      return entry;
    } catch (error) {
      console.error('Error saving mood history:', error);
      throw error;
    }
  }

  async getMoodHistory(userId, period = 'week') {
    try {
      const now = new Date();
      let startDate;

      switch (period) {
        case 'day':
          startDate = new Date(now.setDate(now.getDate() - 1));
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case 'all':
          startDate = new Date(0);
          break;
        default:
          startDate = new Date(now.setDate(now.getDate() - 7));
      }

      return await MoodHistory.find({
        userId,
        timestamp: { $gte: startDate }
      }).sort({ timestamp: -1 });
    } catch (error) {
      console.error('Error getting mood history:', error);
      throw error;
    }
  }

  async getMoodStats(userId, period = 'week') {
    try {
      const history = await this.getMoodHistory(userId, period);
      
      const moodCounts = {};
      history.forEach(entry => {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
      });

      const sortedMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);
      
      return {
        totalEntries: history.length,
        topMood: sortedMoods.length > 0 ? sortedMoods[0][0] : null,
        moodCounts,
        history: history.slice(0, 10) // Return last 10 entries
      };
    } catch (error) {
      console.error('Error getting mood stats:', error);
      throw error;
    }
  }

  // Watchlist Methods
  async addToWatchlist(userId, item) {
    try {
      const watchlist = await Watchlist.findOneAndUpdate(
        { userId },
        {
          $push: {
            items: {
              ...item,
              addedAt: new Date()
            }
          },
          $set: { updatedAt: new Date() }
        },
        { new: true, upsert: true }
      );

      // Track interaction
      await this.trackInteraction(userId, 'watchlist_add', { item }, 'cliq');

      return watchlist;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      throw error;
    }
  }

  async getWatchlist(userId, filter = {}) {
    try {
      const watchlist = await Watchlist.findOne({ userId });
      if (!watchlist) return { items: [] };

      let items = watchlist.items;

      // Apply filters
      if (filter.watched !== undefined) {
        items = items.filter(item => item.watched === filter.watched);
      }
      if (filter.type) {
        items = items.filter(item => item.type === filter.type);
      }

      return { items, updatedAt: watchlist.updatedAt };
    } catch (error) {
      console.error('Error getting watchlist:', error);
      throw error;
    }
  }

  async removeFromWatchlist(userId, itemId) {
    try {
      return await Watchlist.findOneAndUpdate(
        { userId },
        {
          $pull: { items: { _id: itemId } },
          $set: { updatedAt: new Date() }
        },
        { new: true }
      );
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      throw error;
    }
  }

  async markAsWatched(userId, itemId, rating = null, notes = null) {
    try {
      const update = {
        'items.$.watched': true,
        'items.$.watchedAt': new Date(),
        updatedAt: new Date()
      };

      if (rating !== null) update['items.$.rating'] = rating;
      if (notes !== null) update['items.$.notes'] = notes;

      return await Watchlist.findOneAndUpdate(
        { userId, 'items._id': itemId },
        { $set: update },
        { new: true }
      );
    } catch (error) {
      console.error('Error marking as watched:', error);
      throw error;
    }
  }

  async clearWatchlist(userId) {
    try {
      return await Watchlist.findOneAndUpdate(
        { userId },
        {
          $set: { items: [], updatedAt: new Date() }
        },
        { new: true, upsert: true }
      );
    } catch (error) {
      console.error('Error clearing watchlist:', error);
      throw error;
    }
  }

  // Recommendation History Methods
  async saveRecommendation(userId, mood, contentType, recommendations, filters = {}) {
    try {
      return await RecommendationHistory.create({
        userId,
        mood: mood.toLowerCase(),
        contentType,
        recommendations,
        timestamp: new Date(),
        filters
      });
    } catch (error) {
      console.error('Error saving recommendation:', error);
      throw error;
    }
  }

  async getRecommendationHistory(userId, limit = 10) {
    try {
      return await RecommendationHistory.find({ userId })
        .sort({ timestamp: -1 })
        .limit(limit);
    } catch (error) {
      console.error('Error getting recommendation history:', error);
      throw error;
    }
  }

  // User Interaction Tracking
  async trackInteraction(userId, interactionType, details = {}, source = 'cliq') {
    try {
      return await UserInteraction.create({
        userId,
        interactionType,
        details,
        source,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error tracking interaction:', error);
      throw error;
    }
  }

  async getUserInteractions(userId, period = 'week') {
    try {
      const now = new Date();
      let startDate;

      switch (period) {
        case 'day':
          startDate = new Date(now.setDate(now.getDate() - 1));
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          startDate = new Date(now.setDate(now.getDate() - 7));
      }

      return await UserInteraction.find({
        userId,
        timestamp: { $gte: startDate }
      }).sort({ timestamp: -1 });
    } catch (error) {
      console.error('Error getting user interactions:', error);
      throw error;
    }
  }

  // Weekly Summary Methods
  async generateWeeklySummary(userId) {
    try {
      const now = new Date();
      const weekStart = new Date(now.setDate(now.getDate() - 7));
      const weekEnd = new Date();

      // Get mood stats
      const moodStats = await this.getMoodStats(userId, 'week');

      // Get watchlist stats
      const watchlist = await this.getWatchlist(userId);
      const moviesAdded = watchlist.items.filter(item => 
        new Date(item.addedAt) >= weekStart
      ).length;
      const moviesWatched = watchlist.items.filter(item => 
        item.watched && new Date(item.watchedAt) >= weekStart
      ).length;

      // Get recommendation count
      const recommendations = await RecommendationHistory.find({
        userId,
        timestamp: { $gte: weekStart, $lte: weekEnd }
      });

      // Get interactions
      const interactions = await this.getUserInteractions(userId, 'week');

      const summary = {
        userId,
        weekStartDate: weekStart,
        weekEndDate: weekEnd,
        stats: {
          topMood: moodStats.topMood,
          moodCounts: moodStats.moodCounts,
          totalRecommendations: recommendations.length,
          moviesAdded,
          moviesWatched,
          totalInteractions: interactions.length
        },
        recommendations: recommendations.slice(0, 10).map(r => ({
          mood: r.mood,
          contentType: r.contentType,
          timestamp: r.timestamp
        })),
        generatedAt: new Date()
      };

      // Save summary
      await WeeklySummary.create(summary);

      return summary;
    } catch (error) {
      console.error('Error generating weekly summary:', error);
      throw error;
    }
  }

  async getWeeklySummary(userId, weekStartDate = null) {
    try {
      if (!weekStartDate) {
        // Get most recent summary
        return await WeeklySummary.findOne({ userId })
          .sort({ weekStartDate: -1 });
      }

      return await WeeklySummary.findOne({
        userId,
        weekStartDate: { $gte: weekStartDate }
      });
    } catch (error) {
      console.error('Error getting weekly summary:', error);
      throw error;
    }
  }

  // Trending Cache Methods
  async getTrendingCache(mood, contentType) {
    try {
      const cached = await TrendingCache.findOne({
        mood: mood.toLowerCase(),
        contentType,
        expiresAt: { $gt: new Date() }
      });

      return cached ? cached.data : null;
    } catch (error) {
      console.error('Error getting trending cache:', error);
      return null;
    }
  }

  async setTrendingCache(mood, contentType, data, ttlMinutes = 60) {
    try {
      const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

      await TrendingCache.findOneAndUpdate(
        { mood: mood.toLowerCase(), contentType },
        {
          $set: {
            data,
            lastUpdated: new Date(),
            expiresAt
          }
        },
        { upsert: true }
      );
    } catch (error) {
      console.error('Error setting trending cache:', error);
    }
  }

  // Analytics Methods
  async getGlobalMoodTrends(period = 'week') {
    try {
      const now = new Date();
      let startDate;

      switch (period) {
        case 'day':
          startDate = new Date(now.setDate(now.getDate() - 1));
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          startDate = new Date(now.setDate(now.getDate() - 7));
      }

      const trends = await MoodHistory.aggregate([
        { $match: { timestamp: { $gte: startDate } } },
        { $group: { _id: '$mood', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      return trends;
    } catch (error) {
      console.error('Error getting global mood trends:', error);
      throw error;
    }
  }
}

module.exports = DatabaseService;
