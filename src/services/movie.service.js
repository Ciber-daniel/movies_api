const api = require("../config/api.js");

const searchMoviesByQuery = async (title = "", year = "", page = 1) => {
  const url = process.env.API_URL + "search/movie";

  try {
    const response = await api.get(url, {
      params: {
        query: title || undefined,
        year: year || undefined,
        page,
      },
    });

    return response.data?.results;
  } catch (error) {
    return error;
  }
};

const searchMovies = async (
  year = "",
  minRating = "",
  maxRating = "",
  page = 1
) => {
  const url = process.env.API_URL + "discover/movie";

  const params = {
    page: page,
  };

  if (year) {
    params["primary_release_year"] = year;
  }

  if (minRating) {
    params["vote_average.gte"] = minRating;
  }

  if (maxRating) {
    params["vote_average.lte"] = maxRating;
  }

  try {
    const response = await api.get(url, {
      params,
    });

    return response.data?.results;
  } catch (error) {
    if (
      error.response?.data.status_code &&
      error.response?.data.status_code === 34
    ) {
      return Promise.reject(error.response.data);
    }

    return Promise.reject(error);
  }
};

const findMovie = async (id) => {
  const url = process.env.API_URL + `movie/${id}`;

  try {
    const response = await api.get(url);

    return response.data;
  } catch (error) {
    if (
      error.response?.data.status_code &&
      error.response?.data.status_code === 34
    ) {
      return Promise.reject(error.response.data);
    }

    return Promise.reject(error);
  }
};

const findCredits = async (id) => {
  const url = process.env.API_URL + `movie/${id}/credits`;

  try {
    const response = await api.get(url);

    const director = response.data.crew.find(
      (member) => member.job === "Director"
    );

    const filteredCrew = response.data.crew
      .reduce((acc, member) => {
        const count = acc.filter((m) => m.name === member.name).length;
        if (count === 0 && acc.length < 10) {
          acc.push(member);
        }
        return acc;
      }, [])
      .slice(0, 10);

    const data = {
      director: director,
      crew: filteredCrew,
    };

    return data;
  } catch (error) {
    if (
      error.response.data.status_code &&
      error.response.data.status_code === 34
    ) {
      return Promise.reject(error.response.data);
    }
  }
};

module.exports = {
  searchMoviesByQuery,
  searchMovies,
  findMovie,
  findCredits,
};
