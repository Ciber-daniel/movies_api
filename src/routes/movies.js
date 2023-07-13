const { Router } = require("express");
const {
  findMovie,
  searchMovies,
  searchMoviesByQuery,
  findCredits,
} = require("../services/movie.service.js");

const router = Router();

router.get("/", async (req, res) => {
  try {
    let data = [];

    if (req.query?.query) {
      data = await searchMoviesByQuery(
        req.query.query,
        req.query.year,
        req.query.page || 1
      );

      res.send(data);
      return;
    }

    data = await searchMovies(
      req.query?.year,
      req.query?.minRating || 0,
      req.query?.maxRating || 10,
      req.query?.page || 1
    );

    res.send(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const movieId = req.params.id;
    const data = await findMovie(movieId);
    const creditsData = await findCredits(movieId);

    res.send({
      ...data,
      creditsData,
    });
  } catch (error) {
    if (error.status_code === 34) {
      res.status(400).json(error);
      return;
    }

    res.status(500).json(error);
  }
});

module.exports = router;
