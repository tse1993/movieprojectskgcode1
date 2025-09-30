const axios = require('axios');

const tmdbClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: process.env.TMDB_API_KEY
  }
});

const tmdbApi = {
  // 🔄 Transform TMDB data to match frontend Movie interface
  transformMovie(tmdbMovie) {
    return {
      id: tmdbMovie.id,  // TMDB ID becomes frontend id
      title: tmdbMovie.title,
      posterUrl: tmdbMovie.poster_path
        ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
        : null,
      rating: tmdbMovie.vote_average || 0,
      releaseDate: tmdbMovie.release_date || '',
      genre: tmdbMovie.genres?.[0]?.name || 'Unknown', // First genre as string
      overview: tmdbMovie.overview || ''
    };
  },

  async searchMovies(query, page = 1) {
    const response = await tmdbClient.get('/search/movie', {
      params: { query, page }
    });

    return {
      ...response.data,
      results: response.data.results.map(movie => this.transformMovie(movie))
    };
  },

  async getPopularMovies(page = 1) {
    const response = await tmdbClient.get('/movie/popular', {
      params: { page }
    });

    return {
      ...response.data,
      results: response.data.results.map(movie => this.transformMovie(movie))
    };
  },

  async getTopRatedMovies(page = 1) {
    const response = await tmdbClient.get('/movie/top_rated', {
      params: { page }
    });

    return {
      ...response.data,
      results: response.data.results.map(movie => this.transformMovie(movie))
    };
  },

  async getUpcomingMovies(page = 1) {
    const response = await tmdbClient.get('/movie/upcoming', {
      params: { page }
    });

    return {
      ...response.data,
      results: response.data.results.map(movie => this.transformMovie(movie))
    };
  },

  async getMovieDetails(id) {
    const response = await tmdbClient.get(`/movie/${id}`);
    return this.transformMovie(response.data);
  }
};

module.exports = tmdbApi;