const fetch = require('node-fetch');

class ZohoCRMService {
  constructor(config) {
    this.accessToken = config.accessToken;
    this.refreshToken = config.refreshToken;
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.apiDomain = config.apiDomain || 'https://www.zohoapis.com';
  }

  // Refresh access token if needed
  async refreshAccessToken() {
    try {
      const response = await fetch('https://accounts.zoho.com/oauth/v2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          refresh_token: this.refreshToken,
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'refresh_token'
        })
      });

      const data = await response.json();
      if (data.access_token) {
        this.accessToken = data.access_token;
        return data.access_token;
      }
      throw new Error('Failed to refresh token');
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }

  // Make authenticated API call to Zoho CRM
  async makeApiCall(endpoint, method = 'GET', body = null) {
    try {
      const options = {
        method,
        headers: {
          'Authorization': `Zoho-oauthtoken ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${this.apiDomain}${endpoint}`, options);
      
      // If unauthorized, try refreshing token
      if (response.status === 401) {
        await this.refreshAccessToken();
        options.headers['Authorization'] = `Zoho-oauthtoken ${this.accessToken}`;
        return await fetch(`${this.apiDomain}${endpoint}`, options).then(r => r.json());
      }

      return await response.json();
    } catch (error) {
      console.error('CRM API call error:', error);
      throw error;
    }
  }

  // Create or update lead from user interaction
  async syncUserToLead(userProfile, moodHistory, interactions) {
    try {
      const leadData = {
        data: [{
          Last_Name: userProfile.username || `User_${userProfile.userId}`,
          Email: userProfile.email || `${userProfile.userId}@vibeverse.app`,
          Company: 'VibeVerse User',
          Lead_Source: 'VibeVerse Bot',
          Lead_Status: 'Engaged',
          Description: this.generateLeadDescription(userProfile, moodHistory, interactions),
          // Custom fields
          VibeVerse_User_ID: userProfile.userId,
          Last_Mood: moodHistory.length > 0 ? moodHistory[0].mood : 'Unknown',
          Total_Interactions: interactions.length,
          Favorite_Genres: userProfile.preferences?.favoriteGenres?.join(', ') || 'N/A',
          Content_Preference: userProfile.preferences?.defaultContentType || 'both'
        }]
      };

      // Check if lead already exists
      const existingLead = await this.searchLeadByEmail(userProfile.email || `${userProfile.userId}@vibeverse.app`);

      if (existingLead && existingLead.data && existingLead.data.length > 0) {
        // Update existing lead
        const leadId = existingLead.data[0].id;
        return await this.makeApiCall(`/crm/v2/Leads/${leadId}`, 'PUT', leadData);
      } else {
        // Create new lead
        return await this.makeApiCall('/crm/v2/Leads', 'POST', leadData);
      }
    } catch (error) {
      console.error('Error syncing user to lead:', error);
      throw error;
    }
  }

  // Search for lead by email
  async searchLeadByEmail(email) {
    try {
      const query = `(Email:equals:${email})`;
      return await this.makeApiCall(`/crm/v2/Leads/search?criteria=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error('Error searching lead:', error);
      return null;
    }
  }

  // Create note for a lead about recommendations
  async createRecommendationNote(leadId, mood, recommendations) {
    try {
      const noteContent = this.formatRecommendationsForNote(mood, recommendations);
      
      const noteData = {
        data: [{
          Parent_Id: leadId,
          Note_Title: `${mood} Recommendations - ${new Date().toLocaleDateString()}`,
          Note_Content: noteContent,
          se_module: 'Leads'
        }]
      };

      return await this.makeApiCall('/crm/v2/Notes', 'POST', noteData);
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  }

  // Create activity for user interaction
  async createActivity(leadId, activityType, details) {
    try {
      const activityData = {
        data: [{
          Parent_Id: leadId,
          Subject: `VibeVerse: ${activityType}`,
          Activity_Type: 'User Interaction',
          Description: JSON.stringify(details, null, 2),
          Status: 'Completed',
          se_module: 'Leads'
        }]
      };

      return await this.makeApiCall('/crm/v2/Tasks', 'POST', activityData);
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  }

  // Sync watchlist to CRM
  async syncWatchlist(userId, watchlist) {
    try {
      const email = `${userId}@vibeverse.app`;
      const existingLead = await this.searchLeadByEmail(email);

      if (!existingLead || !existingLead.data || existingLead.data.length === 0) {
        console.warn('No lead found for user:', userId);
        return null;
      }

      const leadId = existingLead.data[0].id;
      const watchlistContent = this.formatWatchlistForNote(watchlist);

      const noteData = {
        data: [{
          Parent_Id: leadId,
          Note_Title: `Watchlist - ${new Date().toLocaleDateString()}`,
          Note_Content: watchlistContent,
          se_module: 'Leads'
        }]
      };

      return await this.makeApiCall('/crm/v2/Notes', 'POST', noteData);
    } catch (error) {
      console.error('Error syncing watchlist:', error);
      throw error;
    }
  }

  // Helper: Generate lead description
  generateLeadDescription(userProfile, moodHistory, interactions) {
    const topMoods = this.getTopMoods(moodHistory);
    const activitySummary = `Total interactions: ${interactions.length}\n`;
    const moodSummary = topMoods.length > 0 
      ? `Top moods: ${topMoods.slice(0, 3).map(m => m.mood).join(', ')}\n`
      : '';
    
    return `VibeVerse User Profile\n\n${activitySummary}${moodSummary}\nLast active: ${userProfile.lastActive || new Date()}`;
  }

  // Helper: Get top moods from history
  getTopMoods(moodHistory) {
    const moodCounts = {};
    moodHistory.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });

    return Object.entries(moodCounts)
      .map(([mood, count]) => ({ mood, count }))
      .sort((a, b) => b.count - a.count);
  }

  // Helper: Format recommendations for note
  formatRecommendationsForNote(mood, recommendations) {
    let content = `Mood: ${mood.toUpperCase()}\n\n`;
    
    if (recommendations.movies && recommendations.movies.length > 0) {
      content += '🎬 MOVIES:\n';
      recommendations.movies.forEach((movie, index) => {
        content += `${index + 1}. ${movie.title} (${movie.year || 'N/A'})\n`;
        content += `   Rating: ${movie.rating || 'N/A'}/10\n`;
        content += `   ${movie.overview?.substring(0, 100) || ''}...\n\n`;
      });
    }

    if (recommendations.music && recommendations.music.length > 0) {
      content += '\n🎵 MUSIC:\n';
      recommendations.music.forEach((track, index) => {
        content += `${index + 1}. ${track.title} by ${track.artist || 'Unknown'}\n`;
      });
    }

    return content;
  }

  // Helper: Format watchlist for note
  formatWatchlistForNote(watchlist) {
    if (!watchlist.items || watchlist.items.length === 0) {
      return 'Watchlist is empty.';
    }

    let content = 'USER WATCHLIST:\n\n';
    watchlist.items.forEach((item, index) => {
      const status = item.watched ? '✅' : '⏳';
      content += `${status} ${index + 1}. ${item.title}\n`;
      content += `   Type: ${item.type}\n`;
      if (item.metadata?.year) content += `   Year: ${item.metadata.year}\n`;
      if (item.watched && item.rating) content += `   Rating: ${item.rating}/10\n`;
      content += `   Added: ${new Date(item.addedAt).toLocaleDateString()}\n\n`;
    });

    return content;
  }

  // Create custom module record (if you have custom modules)
  async createCustomRecord(moduleName, recordData) {
    try {
      return await this.makeApiCall(`/crm/v2/${moduleName}`, 'POST', { data: [recordData] });
    } catch (error) {
      console.error('Error creating custom record:', error);
      throw error;
    }
  }

  // Bulk sync multiple users
  async bulkSyncUsers(users) {
    try {
      const results = [];
      for (const user of users) {
        try {
          const result = await this.syncUserToLead(
            user.profile,
            user.moodHistory,
            user.interactions
          );
          results.push({ userId: user.profile.userId, success: true, result });
        } catch (error) {
          results.push({ userId: user.profile.userId, success: false, error: error.message });
        }
      }
      return results;
    } catch (error) {
      console.error('Error bulk syncing users:', error);
      throw error;
    }
  }
}

module.exports = ZohoCRMService;
