const axios = require('axios');

const tmdbClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: process.env.TMDB_API_KEY
  }
});

// TMDB Genre ID to Name mapping
const GENRE_MAP = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
};

const tmdbApi = {
  // 🔄 Transform TMDB data to match frontend Movie interface
  transformMovie(tmdbMovie) {
    // Handle genre - either from genres array (detail endpoint) or genre_ids (list endpoints)
    let genre = 'Unknown';
    if (tmdbMovie.genres && tmdbMovie.genres.length > 0) {
      genre = tmdbMovie.genres[0].name;
    } else if (tmdbMovie.genre_ids && tmdbMovie.genre_ids.length > 0) {
      genre = GENRE_MAP[tmdbMovie.genre_ids[0]] || 'Unknown';
    }

    return {
      id: tmdbMovie.id,  // TMDB ID becomes frontend id
      title: tmdbMovie.title,
      posterUrl: tmdbMovie.poster_path
        ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
        : null,
      backdropUrl: tmdbMovie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${tmdbMovie.backdrop_path}`
        : tmdbMovie.poster_path
        ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
        : null,
      rating: tmdbMovie.vote_average || 0,
      releaseDate: tmdbMovie.release_date || '',
      genre: genre,
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

  // Get genre ID from genre name
  getGenreId(genreName) {
    const entry = Object.entries(GENRE_MAP).find(
      ([id, name]) => name.toLowerCase() === genreName.toLowerCase()
    );
    return entry ? parseInt(entry[0]) : null;
  },

  async getMoviesByGenre(genreName, page = 1) {
    const genreId = this.getGenreId(genreName);

    if (!genreId) {
      throw new Error(`Invalid genre: ${genreName}`);
    }

    const response = await tmdbClient.get('/discover/movie', {
      params: {
        with_genres: genreId,
        page,
        sort_by: 'popularity.desc'
      }
    });

    return {
      ...response.data,
      results: response.data.results.map(movie => this.transformMovie(movie))
    };
  },

  async getMovieDetails(id) {
    // Fetch movie details, videos, and credits in parallel
    const [movieResponse, videosResponse, creditsResponse] = await Promise.all([
      tmdbClient.get(`/movie/${id}`),
      tmdbClient.get(`/movie/${id}/videos`),
      tmdbClient.get(`/movie/${id}/credits`)
    ]);

    // Find YouTube trailer
    const videos = videosResponse.data.results || [];
    const trailer = videos.find(
      video => video.type === 'Trailer' && video.site === 'YouTube'
    );

    const movieData = this.transformMovie(movieResponse.data);

    // Add trailer URL if available
    if (trailer) {
      movieData.trailerUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
    }

    // Add cast and crew information
    const credits = creditsResponse.data;

    // Get top 4 cast members
    if (credits.cast && credits.cast.length > 0) {
      movieData.cast = credits.cast.slice(0, 4).map(person => ({
        id: person.id,
        name: person.name,
        character: person.character,
        profile_path: person.profile_path
          ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
          : null
      }));
    }

    // Get director and producer from crew
    if (credits.crew && credits.crew.length > 0) {
      const director = credits.crew.find(person => person.job === 'Director');
      const producer = credits.crew.find(person => person.job === 'Producer');

      movieData.crew = [];
      if (director) {
        movieData.crew.push({
          id: director.id,
          name: director.name,
          job: 'Director',
          profile_path: director.profile_path
            ? `https://image.tmdb.org/t/p/w185${director.profile_path}`
            : null
        });
      }
      if (producer) {
        movieData.crew.push({
          id: producer.id,
          name: producer.name,
          job: 'Producer',
          profile_path: producer.profile_path
            ? `https://image.tmdb.org/t/p/w185${producer.profile_path}`
            : null
        });
      }
    }

    // Add runtime if available
    if (movieResponse.data.runtime) {
      movieData.runtime = movieResponse.data.runtime;
    }

    return movieData;
  }
};

module.exports = tmdbApi;