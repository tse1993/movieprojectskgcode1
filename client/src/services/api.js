const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('[API] API Base URL:', API_BASE_URL);

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  console.log('[API] getAuthHeader called, token exists:', !!token);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  console.log('[API] handleResponse - Status:', response.status, 'URL:', response.url);

  // Handle 304 Not Modified - no content to parse
  if (response.status === 304) {
    console.log('[API] 304 Not Modified response');
    return null;
  }

  let data;
  try {
    data = await response.json();
    console.log('[API] Response data parsed:', data);
  } catch (parseError) {
    console.error('[API] Failed to parse JSON response:', parseError);
    throw new Error(`Failed to parse response: ${parseError.message}`);
  }

  if (!response.ok) {
    const errorMessage = data.message || data.error || 'Request failed';
    console.error('[API] Request failed:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      errorMessage,
      fullResponse: data
    });
    throw new Error(errorMessage);
  }

  return data;
};

export const api = {
  // Authentication
  register: async (email, name, password) => {
    console.log('[API] register called with:', { email, name, passwordLength: password?.length });
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password })
      });
      const data = await handleResponse(response);
      console.log('[API] register successful:', { email, userId: data.user?._id });
      return data;
    } catch (error) {
      console.error('[API] register failed:', error);
      throw error;
    }
  },

  login: async (email, password) => {
    console.log('[API] login called with:', { email, passwordLength: password?.length });
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await handleResponse(response);
      console.log('[API] login successful:', { email, userId: data.user?._id });
      return data;
    } catch (error) {
      console.error('[API] login failed:', error);
      throw error;
    }
  },

  // Movies
  searchMovies: async (query, page = 1) => {
    console.log('[API] searchMovies called:', { query, page });
    try {
      const response = await fetch(`${API_BASE_URL}/movies/search?q=${encodeURIComponent(query)}&page=${page}`);
      const data = await handleResponse(response);
      console.log('[API] searchMovies successful:', { resultsCount: data.results?.length, totalPages: data.total_pages });
      return data;
    } catch (error) {
      console.error('[API] searchMovies failed:', error);
      throw error;
    }
  },

  getPopularMovies: async (page = 1) => {
    console.log('[API] getPopularMovies called:', { page });
    try {
      const response = await fetch(`${API_BASE_URL}/movies/popular?page=${page}`);
      const data = await handleResponse(response);
      console.log('[API] getPopularMovies successful:', { resultsCount: data.results?.length, totalPages: data.total_pages });
      return data;
    } catch (error) {
      console.error('[API] getPopularMovies failed:', error);
      throw error;
    }
  },

  getTopRatedMovies: async (page = 1) => {
    console.log('[API] getTopRatedMovies called:', { page });
    try {
      const response = await fetch(`${API_BASE_URL}/movies/top-rated?page=${page}`);
      const data = await handleResponse(response);
      console.log('[API] getTopRatedMovies successful:', { resultsCount: data.results?.length, totalPages: data.total_pages });
      return data;
    } catch (error) {
      console.error('[API] getTopRatedMovies failed:', error);
      throw error;
    }
  },

  getUpcomingMovies: async (page = 1) => {
    console.log('[API] getUpcomingMovies called:', { page });
    try {
      const response = await fetch(`${API_BASE_URL}/movies/upcoming?page=${page}`);
      const data = await handleResponse(response);
      console.log('[API] getUpcomingMovies successful:', { resultsCount: data.results?.length, totalPages: data.total_pages });
      return data;
    } catch (error) {
      console.error('[API] getUpcomingMovies failed:', error);
      throw error;
    }
  },

  getMoviesByGenre: async (genre, page = 1) => {
    console.log('[API] getMoviesByGenre called:', { genre, page });
    try {
      const response = await fetch(`${API_BASE_URL}/movies/genre/${encodeURIComponent(genre)}?page=${page}`);
      const data = await handleResponse(response);
      console.log('[API] getMoviesByGenre successful:', { genre, resultsCount: data.results?.length, totalPages: data.total_pages });
      return data;
    } catch (error) {
      console.error('[API] getMoviesByGenre failed:', { genre, page, error });
      throw error;
    }
  },

  getMovieDetails: async (tmdbId) => {
    console.log('[API] getMovieDetails called:', { tmdbId });
    try {
      const response = await fetch(`${API_BASE_URL}/movies/${tmdbId}`, {
        headers: getAuthHeader()
      });
      const data = await handleResponse(response);
      console.log('[API] getMovieDetails successful:', { tmdbId, title: data.title, hasTrailer: !!data.trailerUrl });
      return data;
    } catch (error) {
      console.error('[API] getMovieDetails failed:', { tmdbId, error });
      throw error;
    }
  },

  // User Profile & Statistics
  getProfile: async () => {
    console.log('[API] getProfile called');
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        headers: getAuthHeader()
      });
      const data = await handleResponse(response);
      console.log('[API] getProfile successful:', { email: data.user?.email, name: data.user?.name });
      return data;
    } catch (error) {
      console.error('[API] getProfile failed:', error);
      throw error;
    }
  },

  getStatistics: async () => {
    console.log('[API] getStatistics called');
    try {
      const response = await fetch(`${API_BASE_URL}/user/statistics`, {
        headers: getAuthHeader()
      });
      const data = await handleResponse(response);
      console.log('[API] getStatistics successful:', data);
      return data;
    } catch (error) {
      console.error('[API] getStatistics failed:', error);
      throw error;
    }
  },

  updateProfile: async (name) => {
    console.log('[API] updateProfile called:', { name });
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
      });
      const data = await handleResponse(response);
      console.log('[API] updateProfile successful:', { name: data.user?.name });
      return data;
    } catch (error) {
      console.error('[API] updateProfile failed:', { name, error });
      throw error;
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    console.log('[API] changePassword called');
    try {
      const response = await fetch(`${API_BASE_URL}/user/password`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await handleResponse(response);
      console.log('[API] changePassword successful');
      return data;
    } catch (error) {
      console.error('[API] changePassword failed:', error);
      throw error;
    }
  },

  // Ratings
  rateMovie: async (tmdbId, rating) => {
    console.log('[API] rateMovie called:', { tmdbId, rating });
    try {
      const response = await fetch(`${API_BASE_URL}/user/rate`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tmdbId, rating })
      });
      const data = await handleResponse(response);
      console.log('[API] rateMovie successful:', { tmdbId, rating });
      return data;
    } catch (error) {
      console.error('[API] rateMovie failed:', { tmdbId, rating, error });
      throw error;
    }
  },

  getRatings: async () => {
    console.log('[API] getRatings called');
    try {
      const response = await fetch(`${API_BASE_URL}/user/ratings`, {
        headers: getAuthHeader()
      });
      const data = await handleResponse(response);
      console.log('[API] getRatings successful:', { count: data?.length });
      return data;
    } catch (error) {
      console.error('[API] getRatings failed:', error);
      throw error;
    }
  },

  clearAllRatings: async () => {
    console.log('[API] clearAllRatings called');
    try {
      const response = await fetch(`${API_BASE_URL}/user/ratings`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      const data = await handleResponse(response);
      console.log('[API] clearAllRatings successful');
      return data;
    } catch (error) {
      console.error('[API] clearAllRatings failed:', error);
      throw error;
    }
  },

  // Favorites
  toggleFavorite: async (tmdbId) => {
    console.log('[API] toggleFavorite called:', { tmdbId });
    try {
      const response = await fetch(`${API_BASE_URL}/user/favorite`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tmdbId })
      });
      const data = await handleResponse(response);
      console.log('[API] toggleFavorite successful:', { tmdbId, isFavorite: data.isFavorite });
      return data;
    } catch (error) {
      console.error('[API] toggleFavorite failed:', { tmdbId, error });
      throw error;
    }
  },

  getFavorites: async () => {
    console.log('[API] getFavorites called');
    try {
      const response = await fetch(`${API_BASE_URL}/user/favorites`, {
        headers: getAuthHeader()
      });
      const data = await handleResponse(response);
      console.log('[API] getFavorites successful:', { count: data?.length });
      return data;
    } catch (error) {
      console.error('[API] getFavorites failed:', error);
      throw error;
    }
  },

  clearAllFavorites: async () => {
    console.log('[API] clearAllFavorites called');
    try {
      const response = await fetch(`${API_BASE_URL}/user/favorites`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      const data = await handleResponse(response);
      console.log('[API] clearAllFavorites successful');
      return data;
    } catch (error) {
      console.error('[API] clearAllFavorites failed:', error);
      throw error;
    }
  },

  // Watchlist
  toggleWatchlist: async (tmdbId) => {
    console.log('[API] toggleWatchlist called:', { tmdbId });
    try {
      const response = await fetch(`${API_BASE_URL}/user/watchlist`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tmdbId })
      });
      const data = await handleResponse(response);
      console.log('[API] toggleWatchlist successful:', { tmdbId, isInWatchlist: data.isInWatchlist });
      return data;
    } catch (error) {
      console.error('[API] toggleWatchlist failed:', { tmdbId, error });
      throw error;
    }
  },

  getWatchlist: async () => {
    console.log('[API] getWatchlist called');
    try {
      const response = await fetch(`${API_BASE_URL}/user/watchlist`, {
        headers: getAuthHeader()
      });
      const data = await handleResponse(response);
      console.log('[API] getWatchlist successful:', { count: data?.length });
      return data;
    } catch (error) {
      console.error('[API] getWatchlist failed:', error);
      throw error;
    }
  },

  clearAllWatchlist: async () => {
    console.log('[API] clearAllWatchlist called');
    try {
      const response = await fetch(`${API_BASE_URL}/user/watchlist`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      const data = await handleResponse(response);
      console.log('[API] clearAllWatchlist successful');
      return data;
    } catch (error) {
      console.error('[API] clearAllWatchlist failed:', error);
      throw error;
    }
  },

  // Comments
  getComments: async (tmdbId) => {
    console.log('[API] getComments called:', { tmdbId });
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${tmdbId}`);
      const data = await handleResponse(response);
      console.log('[API] getComments successful:', { tmdbId, count: data?.length });
      return data;
    } catch (error) {
      console.error('[API] getComments failed:', { tmdbId, error });
      throw error;
    }
  },

  addComment: async (tmdbId, content) => {
    console.log('[API] addComment called:', { tmdbId, contentLength: content?.length });
    try {
      const response = await fetch(`${API_BASE_URL}/comments`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tmdbId, content })
      });
      const data = await handleResponse(response);
      console.log('[API] addComment successful:', { tmdbId, commentId: data.comment?._id });
      return data;
    } catch (error) {
      console.error('[API] addComment failed:', { tmdbId, error });
      throw error;
    }
  },

  updateComment: async (commentId, content) => {
    console.log('[API] updateComment called:', { commentId, contentLength: content?.length });
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      });
      const data = await handleResponse(response);
      console.log('[API] updateComment successful:', { commentId });
      return data;
    } catch (error) {
      console.error('[API] updateComment failed:', { commentId, error });
      throw error;
    }
  },

  deleteComment: async (commentId) => {
    console.log('[API] deleteComment called:', { commentId });
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      const data = await handleResponse(response);
      console.log('[API] deleteComment successful:', { commentId });
      return data;
    } catch (error) {
      console.error('[API] deleteComment failed:', { commentId, error });
      throw error;
    }
  },

  // Feed
  getFeed: async (page = 1, limit = 20) => {
    console.log('[API] getFeed called:', { page, limit });
    try {
      const response = await fetch(`${API_BASE_URL}/feed?page=${page}&limit=${limit}`);
      const data = await handleResponse(response);
      console.log('[API] getFeed successful:', { count: data?.items?.length, page });
      return data;
    } catch (error) {
      console.error('[API] getFeed failed:', { page, limit, error });
      throw error;
    }
  }
};
