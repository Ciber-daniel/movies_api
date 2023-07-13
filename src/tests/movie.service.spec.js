const api = require("../config/api.js");
const {
  searchMoviesByQuery,
  searchMovies,
  findMovie,
  findCredits,
} = require("../services/movie.service.js");
jest.mock("../config/api.js");

describe("searchMoviesByQuery", () => {
  it("should call the API with the correct parameters and return the expected results", async () => {
    const expectedTitle = "The Matrix";
    const expectedYear = "1999";
    const expectedPage = 2;
    const mockedResponse = {
      data: {
        results: [
          { id: 1, title: "The Matrix", release_date: "1999-03-31" },
          { id: 2, title: "The Matrix Reloaded", release_date: "2003-05-15" },
        ],
      },
    };
    const expectedResults = mockedResponse?.data.results;

    api.get.mockResolvedValueOnce(mockedResponse);

    const results = await searchMoviesByQuery(
      expectedTitle,
      expectedYear,
      expectedPage
    );

    expect(api.get).toHaveBeenCalledWith(process.env.API_URL + "search/movie", {
      params: {
        query: expectedTitle,
        year: expectedYear,
        page: expectedPage,
      },
    });
    expect(results).toEqual(expectedResults);
  });
});

describe("searchMovies", () => {
  it("should call the API with the correct parameters and return the expected results", async () => {
    const expectedYear = "2021";
    const expectedMinRating = "7";
    const expectedMaxRating = "10";
    const expectedPage = 2;
    const mockedResponse = {
      data: {
        results: [
          { id: 1, title: "Test Movie 1", vote_average: 8 },
          { id: 2, title: "Test Movie 2", vote_average: 9 },
        ],
      },
    };

    api.get.mockResolvedValueOnce(mockedResponse);

    const results = await searchMovies(
      expectedYear,
      expectedMinRating,
      expectedMaxRating,
      expectedPage
    );

    expect(api.get).toHaveBeenCalledWith(
      process.env.API_URL + "discover/movie",
      {
        params: {
          page: expectedPage,
          primary_release_year: expectedYear,
          "vote_average.gte": expectedMinRating,
          "vote_average.lte": expectedMaxRating,
        },
      }
    );
    expect(results).toEqual(mockedResponse.data.results);
  });

  it("should return an error if the API call fails", async () => {
    const expectedError = new Error("API call failed");
    api.get.mockRejectedValueOnce(expectedError);

    await expect(searchMovies()).rejects.toEqual(expectedError);
  });
});

describe("findMovie", () => {
  it("should call the API with the correct parameters and return the expected results", async () => {
    const expectedId = 123;
    const mockedResponse = { data: { id: expectedId, title: "Test Movie" } };

    api.get.mockResolvedValueOnce(mockedResponse);

    const result = await findMovie(expectedId);

    expect(api.get).toHaveBeenCalledWith(
      process.env.API_URL + `movie/${expectedId}`
    );
    expect(result).toEqual(mockedResponse.data);
  });

  it("should return an error if the API call fails", async () => {
    const expectedError = new Error("API call failed");

    api.get.mockRejectedValueOnce(expectedError);

    await expect(findMovie(123)).rejects.toEqual(expectedError);
  });

  it("should return an error if the movie is not found", async () => {
    const expectedError = {
      status_code: 34,
      status_message: "Movie not found",
    };

    api.get.mockRejectedValueOnce({ response: { data: expectedError } });

    await expect(findMovie(123)).rejects.toEqual(expectedError);
  });
});

describe("findCredits", () => {
  it("should call the API with the correct parameters and return the expected results", async () => {
    const expectedId = 123;
    const mockedResponse = {
      data: {
        crew: [
          { name: "Director 1", job: "Director" },
          { name: "Actor 1", job: "Actor" },
          { name: "Actor 2", job: "Actor" },
          { name: "Actor 3", job: "Actor" },
          { name: "Actor 4", job: "Actor" },
          { name: "Actor 5", job: "Actor" },
          { name: "Actor 6", job: "Actor" },
          { name: "Actor 7", job: "Actor" },
          { name: "Actor 8", job: "Actor" },
        ],
      },
    };
    const expectedDirector = { name: "Director 1", job: "Director" };
    const expectedCrew = [
      { name: "Director 1", job: "Director" },
      { name: "Actor 1", job: "Actor" },
      { name: "Actor 2", job: "Actor" },
      { name: "Actor 3", job: "Actor" },
      { name: "Actor 4", job: "Actor" },
      { name: "Actor 5", job: "Actor" },
      { name: "Actor 6", job: "Actor" },
      { name: "Actor 7", job: "Actor" },
      { name: "Actor 8", job: "Actor" },
    ];

    api.get.mockResolvedValueOnce(mockedResponse);

    const results = await findCredits(expectedId);

    expect(api.get).toHaveBeenCalledWith(
      process.env.API_URL + `movie/${expectedId}/credits`
    );
    expect(results.director).toEqual(expectedDirector);
    expect(results.crew).toEqual(expectedCrew);
  });

  it("should return an error if the movie is not found", async () => {
    const expectedError = {
      status_code: 34,
      status_message: "Movie not found",
    };

    api.get.mockRejectedValueOnce({ response: { data: expectedError } });

    await expect(findCredits(123)).rejects.toEqual(expectedError);
  });
});
