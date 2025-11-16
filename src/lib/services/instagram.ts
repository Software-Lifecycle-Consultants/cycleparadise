// Instagram Basic Display API integration
// This service handles Instagram API calls and caching

interface InstagramPost {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
  timestamp: string;
}

interface InstagramApiResponse {
  data: InstagramPost[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

interface CachedInstagramData {
  posts: InstagramPost[];
  lastFetched: number;
  expiresAt: number;
}

class InstagramService {
  private static instance: InstagramService;
  private accessToken: string | undefined;
  private cache = new Map<string, CachedInstagramData>();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
  private readonly API_BASE_URL = 'https://graph.instagram.com';

  constructor() {
    this.accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  }

  static getInstance(): InstagramService {
    if (!InstagramService.instance) {
      InstagramService.instance = new InstagramService();
    }
    return InstagramService.instance;
  }

  /**
   * Fetch Instagram posts for a user
   * @param userId Instagram User ID (optional, defaults to 'me')
   * @param limit Number of posts to fetch (max 25)
   * @returns Promise<InstagramPost[]>
   */
  async getUserPosts(userId: string = 'me', limit: number = 6): Promise<InstagramPost[]> {
    if (!this.accessToken) {
      console.warn('Instagram access token not configured, using fallback data');
      return this.getFallbackPosts(limit);
    }

    const cacheKey = `${userId}-${limit}`;
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.posts;
    }

    try {
      const url = new URL(`${this.API_BASE_URL}/${userId}/media`);
      url.searchParams.set('fields', 'id,media_type,media_url,thumbnail_url,permalink,caption,timestamp');
      url.searchParams.set('limit', Math.min(limit, 25).toString());
      url.searchParams.set('access_token', this.accessToken);

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`Instagram API error: ${response.status} ${response.statusText}`);
      }

      const data: InstagramApiResponse = await response.json();
      
      // Filter to only images and videos, process the data
      const posts = data.data
        .filter(post => post.media_type === 'IMAGE' || post.media_type === 'VIDEO')
        .map(post => ({
          ...post,
          caption: post.caption || '',
          media_url: post.media_type === 'VIDEO' ? (post.thumbnail_url || post.media_url) : post.media_url
        }))
        .slice(0, limit);

      // Cache the results
      this.cache.set(cacheKey, {
        posts,
        lastFetched: Date.now(),
        expiresAt: Date.now() + this.CACHE_DURATION
      });

      return posts;
    } catch (error) {
      console.error('Failed to fetch Instagram posts:', error);
      
      // Return cached data if available, even if expired
      if (cached) {
        console.log('Returning expired cached Instagram data');
        return cached.posts;
      }
      
      // Return fallback data
      return this.getFallbackPosts(limit);
    }
  }

  /**
   * Fetch posts by hashtag (requires Instagram Basic Display API v2 or Business API)
   * Note: This is a simplified implementation - real hashtag search requires business API
   * @param hashtag Hashtag to search for
   * @param limit Number of posts to fetch
   * @returns Promise<InstagramPost[]>
   */
  async getHashtagPosts(hashtag: string, limit: number = 6): Promise<InstagramPost[]> {
    // For demonstration purposes, we'll return user posts
    // In a real implementation, you would use Instagram Business API
    console.log(`Hashtag search for #${hashtag} - using fallback to user posts`);
    return this.getUserPosts('me', limit);
  }

  /**
   * Refresh Instagram access token
   * Long-lived tokens need to be refreshed every 60 days
   */
  async refreshAccessToken(): Promise<string | null> {
    if (!this.accessToken) {
      return null;
    }

    try {
      const url = new URL(`${this.API_BASE_URL}/refresh_access_token`);
      url.searchParams.set('grant_type', 'ig_refresh_token');
      url.searchParams.set('access_token', this.accessToken);

      const response = await fetch(url.toString());
      const data = await response.json();

      if (data.access_token) {
        this.accessToken = data.access_token;
        // In a real implementation, you would save this to your database/env
        console.log('Instagram access token refreshed successfully');
        return data.access_token;
      }
    } catch (error) {
      console.error('Failed to refresh Instagram access token:', error);
    }

    return null;
  }

  /**
   * Validate Instagram access token
   */
  async validateAccessToken(): Promise<boolean> {
    if (!this.accessToken) {
      return false;
    }

    try {
      const url = new URL(`${this.API_BASE_URL}/me`);
      url.searchParams.set('fields', 'id,username');
      url.searchParams.set('access_token', this.accessToken);

      const response = await fetch(url.toString());
      return response.ok;
    } catch (error) {
      console.error('Failed to validate Instagram access token:', error);
      return false;
    }
  }

  /**
   * Get fallback Instagram posts for development/demo
   */
  private getFallbackPosts(limit: number): InstagramPost[] {
    const fallbackPosts: InstagramPost[] = [
      {
        id: 'fallback_1',
        media_type: 'IMAGE',
        media_url: '/images/instagram/cycle-hill-country.jpg',
        permalink: 'https://instagram.com/p/fallback1',
        caption: 'Cycling through the misty tea plantations of Sri Lanka\'s hill country. The morning mist and rolling hills create the perfect backdrop for an unforgettable ride! 🚴‍♂️ #CycleParadise #SriLanka #HillCountry #TeaPlantations',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'fallback_2',
        media_type: 'IMAGE',
        media_url: '/images/instagram/coastal-sunset-ride.jpg',
        permalink: 'https://instagram.com/p/fallback2',
        caption: 'Golden hour cycling along the southern coast. Nothing beats the feeling of ocean breeze and stunning sunsets! 🌅 #CoastalRide #Sunset #CyclingLife #SriLankanCoast',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'fallback_3',
        media_type: 'IMAGE',
        media_url: '/images/instagram/sigiriya-adventure.jpg',
        permalink: 'https://instagram.com/p/fallback3',
        caption: 'Made it to Sigiriya Rock! The cycle here was challenging but totally worth it for this incredible view. Ancient history meets modern adventure! 🏛️ #Sigiriya #CulturalTriangle #Adventure #History',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'fallback_4',
        media_type: 'IMAGE',
        media_url: '/images/instagram/group-cycling-fun.jpg',
        permalink: 'https://instagram.com/p/fallback4',
        caption: 'Our amazing group from Germany exploring the backroads of Sri Lanka! New friendships, shared adventures, and unforgettable memories. 👥 #GroupTour #NewFriends #CyclingCommunity #Adventure',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'fallback_5',
        media_type: 'IMAGE',
        media_url: '/images/instagram/local-village-visit.jpg',
        permalink: 'https://instagram.com/p/fallback5',
        caption: 'Stopping by a local village for fresh king coconut water. The warmth and hospitality of Sri Lankan people never fails to amaze us! 🥥 #LocalCulture #VillageLife #Hospitality #Authentic',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'fallback_6',
        media_type: 'IMAGE',
        media_url: '/images/instagram/wildlife-encounter.jpg',
        permalink: 'https://instagram.com/p/fallback6',
        caption: 'Unexpected wildlife encounter on today\'s ride! Sri Lanka\'s biodiversity never ceases to amaze. Remember to respect nature and wildlife! 🐘 #Wildlife #Nature #Biodiversity #ResponsibleTourism',
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    return fallbackPosts.slice(0, limit);
  }

  /**
   * Clear cache (useful for testing)
   */
  clearCache(): void {
    this.cache.clear();
  }
}

export { InstagramService, type InstagramPost };
export default InstagramService.getInstance();