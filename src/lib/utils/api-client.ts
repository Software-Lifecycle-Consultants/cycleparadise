/**
 * Enhanced API client with error handling and session management
 */

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  code?: string;
}

export interface ApiClientOptions {
  onSessionExpired?: () => void;
  showToast?: boolean;
}

export class ApiClient {
  private defaultOptions: ApiClientOptions = {
    onSessionExpired: () => {
      if (typeof window !== 'undefined') {
        (window as any).toastManager?.error('Session expired. Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 1500);
      }
    },
    showToast: true,
  };

  constructor(private options: ApiClientOptions = {}) {
    this.options = { ...this.defaultOptions, ...options };
  }

  /**
   * Make API request with enhanced error handling
   */
  async request<T = any>(
    url: string,
    options: RequestInit = {}
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      // Handle session expiration
      if (response.status === 401) {
        this.options.onSessionExpired?.();
        return {
          success: false,
          error: 'Session expired',
        };
      }

      // Parse response
      const responseData: ApiResponse<T> = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: responseData.data,
        };
      } else {
        // API returned error
        const errorMessage = responseData.error || responseData.message || 'Operation failed';
        return {
          success: false,
          error: errorMessage,
        };
      }
    } catch (error) {
      // Network error or parsing error
      console.error('API request failed:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.',
      };
    }
  }

  /**
   * Convenience methods for different HTTP verbs
   */
  async get<T = any>(url: string): Promise<{ success: boolean; data?: T; error?: string }> {
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T = any>(
    url: string,
    body: any
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    return this.request<T>(url, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T = any>(
    url: string,
    body: any
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    return this.request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T = any>(url: string): Promise<{ success: boolean; data?: T; error?: string }> {
    return this.request<T>(url, { method: 'DELETE' });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Make available globally
if (typeof window !== 'undefined') {
  (window as any).apiClient = apiClient;
}
