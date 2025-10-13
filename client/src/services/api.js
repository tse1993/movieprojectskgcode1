const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  // Handle 304 Not Modified - no content to parse
  if (response.status === 304) {
    return null;
  }

  let data;
  try {
    data = await response.json();
  } catch (parseError) {
    console.error('[API] Failed to parse JSON response:', parseError);
    throw new Error(`Failed to parse response: ${parseError.message}`);
  }

  if (!response.ok) {
    const errorMessage = data.message || data.error || 'Request failed';
    console.error('[API] Request failed:', response.status, response.url, errorMessage);
    throw new Error(errorMessage);
  }

  return data;
};

export const api = {
  // Authentication
  register: async (email, name, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password })
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] Register failed:', error);
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] Login failed:', error);
      throw error;
    }
  },

  // Movies
  searchMovies: async (query, page = 1) => {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/search?q=${encodeURIComponent(query)}&page=${page}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] Search movies failed:', error);
      throw error;
    }
  },

  getPopularMovies: async (page = 1) => {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/popular?page=${page}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] Get popular movies failed:', error);
      throw error;
    }
  },

  getTopRatedMovies: async (page = 1) => {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/top-rated?page=${page}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] Get top-rated movies failed:', error);
      throw error;
    }
  },

  getUpcomingMovies: async (page = 1) => {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/upcoming?page=${page}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] Get upcoming movies failed:', error);
      throw error;
    }
  },

  getMoviesByGenre: async (genre, page = 1) => {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/genre/${encodeURIComponent(genre)}?page=${page}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] Get movies by genre failed:', error);
      throw error;
    }
  },

  getMovieDetails: async (tmdbId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/${tmdbId}`, {
        headers: getAuthHeader()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] Get movie details failed:', error);
      throw error;
    }
  },

  // User Profile & Statistics
  getProfile: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        headers: getAuthHeader()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] Get profile failed:', error);
      throw error;
    }
  },

  getStatistics: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/statistics`, {
        headers: getAuthHeader()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] Get statistics failed:', error);
      throw error;
    }
  },

  updateProfile: async (name) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] Update profile failed:', error);
      throw error;
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/password`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] Change password failed:', error);
      throw error;
    }
  },

  // Ratings
  rateMovie: async (tmdbId, rating) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/rate`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tmdbId, rating })
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] Rate movie failed:', error);
      throw error;
    }
  },

  getRatings: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/ratings`, {
        headers: getAuthHeader()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] Get ratings failed:', error);
      throw error;
    }
  },

  clearAllRatings: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/ratings`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] Clear ratings failed:', error);
      throw error;
    }
  },

  // Favorites
  toggleFavorite: async (tmdbId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/favorite`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tmdbId })
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] Toggle favorite failed:', error);
      throw error;
    }
  },

  getFavorites: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/favorites`, {
        headers: getAuthHeader()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] Get favorites failed:', error);
      throw error;
    }
  },

  clearAllFavorites: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/favorites`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] Clear favorites failed:', error);
      throw error;
    }
  },

  // Watchlist
  toggleWatchlist: async (tmdbId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/watchlist`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tmdbId })
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] Toggle watchlist failed:', error);
      throw error;
    }
  },

  getWatchlist: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/watchlist`, {
        headers: getAuthHeader()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] Get watchlist failed:', error);
      throw error;
    }
  },

  clearAllWatchlist: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/watchlist`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] Clear watchlist failed:', error);
      throw error;
    }
  },

  // Comments
  getComments: async (tmdbId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${tmdbId}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] Get comments failed:', error);
      throw error;
    }
  },

  addComment: async (tmdbId, content) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tmdbId, content })
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] Add comment failed:', error);
      throw error;
    }
  },

  updateComment: async (commentId, content) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] Update comment failed:', error);
      throw error;
    }
  },

  deleteComment: async (commentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] Delete comment failed:', error);
      throw error;
    }
  },

  // Feed
  getFeed: async (page = 1, limit = 20) => {
    try {
      const response = await fetch(`${API_BASE_URL}/feed?page=${page}&limit=${limit}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] Get feed failed:', error);
      throw error;
    }
  },

  // Public User Profile
  getUserPublicProfile: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/public-profile`);
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] Get user public profile failed:', error);
      throw error;
    }
  }
};
