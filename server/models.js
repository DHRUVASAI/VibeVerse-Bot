const mongoose = require('mongoose');

// User Profile Schema
const userProfileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  username: String,
  email: String,
  preferences: {
    favoriteGenres: [String],
    favoriteLanguages: [String],
    defaultContentType: {
      type: String,
      enum: ['movies', 'music', 'both'],
      default: 'both'
    },
    filters: {
      minRating: Number,
      yearRange: {
        start: Number,
        end: Number
      },
      excludeGenres: [String]
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

// Mood History Schema
const moodHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  mood: {
    type: String,
    required: true,
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  context: {
    command: String,
    contentType: String,
    source: String // 'cliq', 'salesiq', 'web'
  },
  recommendationsReceived: {
    type: Number,
    default: 0
  }
});

// Compound index for efficient querying
moodHistorySchema.index({ userId: 1, timestamp: -1 });

// Watchlist Schema
const watchlistSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  items: [{
    type: {
      type: String,
      enum: ['movie', 'tv', 'music'],
      required: true
    },
    externalId: String, // TMDB ID or Spotify ID
    title: {
      type: String,
      required: true
    },
    metadata: {
      year: Number,
      genre: [String],
      rating: Number,
      posterUrl: String,
      overview: String
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    watched: {
      type: Boolean,
      default: false
    },
    watchedAt: Date,
    rating: Number, // User's personal rating
    notes: String
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Recommendation History Schema
const recommendationHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  mood: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    enum: ['movies', 'music', 'both'],
    default: 'both'
  },
  recommendations: [{
    type: String,
    itemType: String,
    externalId: String,
    title: String,
    clicked: Boolean,
    addedToWatchlist: Boolean
  }],
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  filters: mongoose.Schema.Types.Mixed,
  interactionCount: {
    type: Number,
    default: 0
  }
});

// User Interaction Schema (for CRM)
const userInteractionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  interactionType: {
    type: String,
    enum: ['command', 'mood_selection', 'watchlist_add', 'recommendation_click', 'filter_applied'],
    required: true
  },
  details: mongoose.Schema.Types.Mixed,
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  source: {
    type: String,
    enum: ['cliq', 'salesiq', 'web'],
    required: true
  },
  sessionId: String
});

// Weekly Summary Schema
const weeklySummarySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  weekStartDate: {
    type: Date,
    required: true,
    index: true
  },
  weekEndDate: {
    type: Date,
    required: true
  },
  stats: {
    topMood: String,
    moodCounts: mongoose.Schema.Types.Mixed,
    totalRecommendations: Number,
    moviesAdded: Number,
    moviesWatched: Number,
    totalInteractions: Number
  },
  recommendations: [{
    title: String,
    type: String,
    mood: String
  }],
  generatedAt: {
    type: Date,
    default: Date.now
  },
  sentAt: Date
});

// Compound index for weekly summaries
weeklySummarySchema.index({ userId: 1, weekStartDate: -1 });

// Trending Cache Schema
const trendingCacheSchema = new mongoose.Schema({
  mood: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  contentType: {
    type: String,
    enum: ['movies', 'tv', 'music'],
    required: true
  },
  data: mongoose.Schema.Types.Mixed,
  lastUpdated: {
    type: Date,
    default: Date.now,
    index: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  }
});

// TTL index for auto-deletion
trendingCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Models
const UserProfile = mongoose.model('UserProfile', userProfileSchema);
const MoodHistory = mongoose.model('MoodHistory', moodHistorySchema);
const Watchlist = mongoose.model('Watchlist', watchlistSchema);
const RecommendationHistory = mongoose.model('RecommendationHistory', recommendationHistorySchema);
const UserInteraction = mongoose.model('UserInteraction', userInteractionSchema);
const WeeklySummary = mongoose.model('WeeklySummary', weeklySummarySchema);
const TrendingCache = mongoose.model('TrendingCache', trendingCacheSchema);

module.exports = {
  UserProfile,
  MoodHistory,
  Watchlist,
  RecommendationHistory,
  UserInteraction,
  WeeklySummary,
  TrendingCache
};
