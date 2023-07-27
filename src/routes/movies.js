const express = require("express");
const { Router } = express;
const {
  searchMovies,
  searchMoviesByQuery,
  findMovie,
  findCredits,
} = require("../services/movie.service.js");

const router = Router();

/**
 * @openapi
 * /movies:
 *  get:
 *     tags:
 *     - movies
 *     description: Responds if the app is up and running
 *     parameters:
 *      - name: query
 *        in: query
 *        description: Búsqueda de texto libre
 *        type: string
 *        required: false
 *      - name: year
 *        in: query
 *        description: Año de lanzamiento de la película
 *        type: string
 *        required: false
 *      - name: minRating
 *        in: query
 *        description: Calificación mínima de la película
 *        type: integer
 *        required: false
 *      - name: maxRating
 *        in: query
 *        description: Calificación máxima de la película
 *        type: integer
 *        required: false
 *      - name: page
 *        in: query
 *        description: Número de página
 *        type: integer
 *        required: false
 *     responses:
 *       200:
 *         description: App is up and running
 *         content:
 *          application/json:
 *           schema:
 *             type: object
 *             properties:
 *              message:
 *               type: string
 *              adult:
 *               type: boolean
 *              backdrop_path:
 *                type: string
 *              genre_ids:
 *                type: array
 *                items:
 *                  type:integer
 *              id:
 *                type: integer
 *              original_language:
 *                type: string
 *              original_title:
 *                type: string
 *              overview:
 *                type: string
 *              popularity:
 *                type: string
 *              poster_path:
 *                type: string
 *              release_date:
 *                type: string
 *                format: date
 *              title:
 *                type: string
 *              video:
 *                type: boolean
 *              vote_average:
 *                type: number
 *              vote_count:
 *                type: integer
 *
 */
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

/**
 * @openapi
 * /movies/{id}:
 *  get:
 *     tags:
 *     - movies by id
 *     description: Responds if the app is up and running
 *     parameters:
 *     - name: id
 *       in: path
 *       description: ID de la película
 *       type: integer
 *       required: true
 *     responses:
 *       200:
 *         description: App is up and running
 *         content:
 *          application/json:
 *           schema:
 *             type: object
 *             properties:
 *              adult:
 *               type: boolean
 *              backdrop_path:
 *               type: string
 *              belongs_to_collection:
 *                type: object
 *              budget:
 *                type: integer
 *              genres:
 *                type: array
 *                items:
 *                  type: object
 *              homepage:
 *                type: string
 *              id:
 *                type: integer
 *              imdb_id:
 *                type: string
 *              original_language:
 *                type: string
 *              original_title:
 *                type: string
 *              overview:
 *                type: string
 *              popularity:
 *                type: number
 *              poster_path:
 *                type: string
 *              production_companies:
 *                type: array
 *                items:
 *                  type: object
 *              production_countries:
 *                type: array
 *                items:
 *                  type: object
 *              release_date:
 *                type: string
 *                format: date
 *              revenue:
 *                type: integer
 *              runtime:
 *                type: interger
 *                format: date
 *              spoken_languages:
 *                type: array
 *                items:
 *                  type: object
 *              status:
 *                type: string
 *              tagline:
 *                type: string
 *              title:
 *                type: string
 *              video:
 *                type: boolean
 *              vote_average:
 *                type: number
 *              vote_count:
 *                type: integer
 *              credits:
 *                type: object
 *                properties:
 *                 director:
 *                  type: Object
 *                  properties:
 *                   adult:
 *                    type: boolean
 *                   gender:
 *                    type: integer
 *                   id:
 *                    type: integer
 *                   known_for_department:
 *                    type: string
 *                   name:
 *                    type: string
 *                   original_name:
 *                    type: string
 *                   popularity:
 *                    type: number
 *                   profile_path:
 *                    type: string
 *                   credit_id:
 *                    type: string
 *                   department:
 *                    type: string
 *                   job:
 *                    type: string
 *                 crew:
 *                  type: array
 *                  items:
 *                   type: object
 *                   properties:
 *                    adult:
 *                      type: boolean
 *                    genres:
 *                      type: integer
 *                    id:
 *                      type: integer
 *                    known_for_department:
 *                      type: string
 *                    name:
 *                      type: string
 *                    original_name:
 *                      type: string
 *                    popularity:
 *                      type: number
 *                    profile_path:
 *                      type: string
 *                    credit_id:
 *                      type: string
 *                    department:
 *                      type: string
 *                    job:
 *                      type: string
 */
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const movie = await findMovie(id);
    const credits = await findCredits(id);
    const movieDetails = { ...movie, credits };

    res.json(movieDetails);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
