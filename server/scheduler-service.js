const cron = require('node-cron');
const DatabaseService = require('./database-service');
const ZohoCRMService = require('./zoho-crm-service');

class SchedulerService {
  constructor(config) {
    this.config = config;
    this.db = new DatabaseService();
    this.crm = config.crmEnabled ? new ZohoCRMService(config.crm) : null;
    this.jobs = [];
  }

  // Initialize all scheduled jobs
  init() {
    console.log('🕐 Initializing scheduler service...');

    // Weekly summary generation - Every Monday at 9:00 AM
    this.scheduleWeeklySummaries();

    // Daily CRM sync - Every day at midnight
    if (this.crm && this.config.enableAutoCrmSync) {
      this.scheduleDailyCRMSync();
    }

    // Trending cache refresh - Every 30 minutes
    this.scheduleTrendingCacheRefresh();

    // Cleanup old data - Every Sunday at 2:00 AM
    this.scheduleDataCleanup();

    console.log(`✅ Initialized ${this.jobs.length} scheduled jobs`);
  }

  // Schedule weekly summary generation
  scheduleWeeklySummaries() {
    // Runs every Monday at 9:00 AM
    const job = cron.schedule('0 9 * * 1', async () => {
      console.log('📅 Running weekly summary generation...');
      try {
        await this.generateAllWeeklySummaries();
        console.log('✅ Weekly summaries generated successfully');
      } catch (error) {
        console.error('❌ Error generating weekly summaries:', error);
      }
    });

    this.jobs.push({ name: 'weekly-summaries', job });
  }

  // Generate weekly summaries for all active users
  async generateAllWeeklySummaries() {
    try {
      // Get all users who were active in the last week
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const { UserProfile } = require('./models');
      
      const activeUsers = await UserProfile.find({
        lastActive: { $gte: oneWeekAgo }
      }).select('userId');

      console.log(`📊 Generating summaries for ${activeUsers.length} active users`);

      let successCount = 0;
      let errorCount = 0;

      for (const user of activeUsers) {
        try {
          const summary = await this.db.generateWeeklySummary(user.userId);
          
          // Send summary notification (implement based on platform)
          await this.sendSummaryNotification(user.userId, summary);
          
          successCount++;
        } catch (error) {
          console.error(`Error generating summary for user ${user.userId}:`, error);
          errorCount++;
        }
      }

      console.log(`✅ Summary generation complete: ${successCount} success, ${errorCount} errors`);

      return { successCount, errorCount, total: activeUsers.length };
    } catch (error) {
      console.error('Error in generateAllWeeklySummaries:', error);
      throw error;
    }
  }

  // Send summary notification to user
  async sendSummaryNotification(userId, summary) {
    // Implement notification logic based on platform (Cliq, email, etc.)
    console.log(`📬 Sending summary notification to user ${userId}`);
    
    // If CRM is enabled, create a note
    if (this.crm) {
      try {
        const profile = await this.db.getUserProfile(userId);
        const email = profile.email || `${userId}@vibeverse.app`;
        const lead = await this.crm.searchLeadByEmail(email);
        
        if (lead && lead.data && lead.data.length > 0) {
          const noteContent = this.formatSummaryForCRM(summary);
          await this.crm.createRecommendationNote(lead.data[0].id, 'Weekly Summary', noteContent);
        }
      } catch (error) {
        console.error('Error sending CRM notification:', error);
      }
    }
  }

  // Schedule daily CRM sync
  scheduleDailyCRMSync() {
    // Runs every day at midnight
    const job = cron.schedule('0 0 * * *', async () => {
      console.log('🔄 Running daily CRM sync...');
      try {
        await this.syncActiveusersToCRM();
        console.log('✅ Daily CRM sync completed');
      } catch (error) {
        console.error('❌ Error in daily CRM sync:', error);
      }
    });

    this.jobs.push({ name: 'daily-crm-sync', job });
  }

  // Sync active users to CRM
  async syncActiveusersToCRM() {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const { UserProfile } = require('./models');
      
      const activeUsers = await UserProfile.find({
        lastActive: { $gte: oneDayAgo }
      }).select('userId').limit(100); // Limit to 100 per run to avoid API limits

      console.log(`🔄 Syncing ${activeUsers.length} active users to CRM`);

      const users = await Promise.all(activeUsers.map(async user => {
        const profile = await this.db.getUserProfile(user.userId);
        const moodHistory = await this.db.getMoodHistory(user.userId, 'month');
        const interactions = await this.db.getUserInteractions(user.userId, 'month');
        return { profile, moodHistory, interactions };
      }));

      const results = await this.crm.bulkSyncUsers(users);

      const successCount = results.filter(r => r.success).length;
      const errorCount = results.filter(r => !r.success).length;

      console.log(`✅ CRM sync complete: ${successCount} success, ${errorCount} errors`);

      return { successCount, errorCount, total: activeUsers.length };
    } catch (error) {
      console.error('Error syncing users to CRM:', error);
      throw error;
    }
  }

  // Schedule trending cache refresh
  scheduleTrendingCacheRefresh() {
    // Runs every 30 minutes
    const job = cron.schedule('*/30 * * * *', async () => {
      console.log('🔥 Refreshing trending cache...');
      try {
        await this.refreshTrendingCache();
        console.log('✅ Trending cache refreshed');
      } catch (error) {
        console.error('❌ Error refreshing trending cache:', error);
      }
    });

    this.jobs.push({ name: 'trending-cache-refresh', job });
  }

  // Refresh trending cache for popular moods
  async refreshTrendingCache() {
    const popularMoods = ['happy', 'romantic', 'sad', 'thriller', 'action', 'comedy'];
    const contentTypes = ['movies', 'tv'];

    for (const mood of popularMoods) {
      for (const contentType of contentTypes) {
        try {
          // Fetch fresh trending data
          const EnhancedAPIService = require('./enhanced-api-service');
          const api = new EnhancedAPIService(this.config);
          
          let trendingData;
          if (contentType === 'movies') {
            trendingData = await api.fetchTrendingMovies(mood, 20);
          } else {
            trendingData = await api.fetchTrendingTV(mood, 20);
          }

          // Update cache
          await this.db.setTrendingCache(mood, contentType, trendingData, 60);
          
        } catch (error) {
          console.error(`Error refreshing cache for ${mood}/${contentType}:`, error);
        }
      }
    }
  }

  // Schedule data cleanup
  scheduleDataCleanup() {
    // Runs every Sunday at 2:00 AM
    const job = cron.schedule('0 2 * * 0', async () => {
      console.log('🧹 Running data cleanup...');
      try {
        await this.cleanupOldData();
        console.log('✅ Data cleanup completed');
      } catch (error) {
        console.error('❌ Error in data cleanup:', error);
      }
    });

    this.jobs.push({ name: 'data-cleanup', job });
  }

  // Cleanup old data
  async cleanupOldData() {
    try {
      const { MoodHistory, UserInteraction, RecommendationHistory } = require('./models');
      
      // Delete mood history older than 6 months
      const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
      const deletedMoods = await MoodHistory.deleteMany({
        timestamp: { $lt: sixMonthsAgo }
      });

      // Delete interactions older than 3 months
      const threeMonthsAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      const deletedInteractions = await UserInteraction.deleteMany({
        timestamp: { $lt: threeMonthsAgo }
      });

      // Delete recommendation history older than 6 months
      const deletedRecommendations = await RecommendationHistory.deleteMany({
        timestamp: { $lt: sixMonthsAgo }
      });

      console.log(`🧹 Cleanup results:
        - Mood history: ${deletedMoods.deletedCount} records
        - Interactions: ${deletedInteractions.deletedCount} records
        - Recommendations: ${deletedRecommendations.deletedCount} records
      `);

      return {
        deletedMoods: deletedMoods.deletedCount,
        deletedInteractions: deletedInteractions.deletedCount,
        deletedRecommendations: deletedRecommendations.deletedCount
      };
    } catch (error) {
      console.error('Error cleaning up old data:', error);
      throw error;
    }
  }

  // Stop all scheduled jobs
  stopAll() {
    console.log('🛑 Stopping all scheduled jobs...');
    this.jobs.forEach(({ name, job }) => {
      job.stop();
      console.log(`  Stopped: ${name}`);
    });
    console.log('✅ All scheduled jobs stopped');
  }

  // Manually trigger a job
  async triggerJob(jobName) {
    switch (jobName) {
      case 'weekly-summaries':
        return await this.generateAllWeeklySummaries();
      case 'daily-crm-sync':
        return await this.syncActiveusersToCRM();
      case 'trending-cache-refresh':
        return await this.refreshTrendingCache();
      case 'data-cleanup':
        return await this.cleanupOldData();
      default:
        throw new Error(`Unknown job: ${jobName}`);
    }
  }

  // Helper: Format summary for CRM
  formatSummaryForCRM(summary) {
    return `
WEEKLY VIBEVERSE SUMMARY
========================
Period: ${new Date(summary.weekStartDate).toLocaleDateString()} - ${new Date(summary.weekEndDate).toLocaleDateString()}

TOP MOOD: ${summary.stats.topMood || 'N/A'}
Total Recommendations: ${summary.stats.totalRecommendations || 0}
Movies Added to Watchlist: ${summary.stats.moviesAdded || 0}
Movies Watched: ${summary.stats.moviesWatched || 0}
Total Interactions: ${summary.stats.totalInteractions || 0}

MOOD BREAKDOWN:
${Object.entries(summary.stats.moodCounts || {})
  .map(([mood, count]) => `  ${mood}: ${count}`)
  .join('\n')}
    `.trim();
  }
}

module.exports = SchedulerService;
