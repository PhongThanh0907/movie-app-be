import express from "express";
import {
  DeletedMovieController,
  GetAllMovieController,
  GetMovieController,
  createdMovieController,
  updatedMovieController,
  UpdateLikeMovieController,
} from "../controllers/movie.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *   Movie:
 *     type: object
 *     properties:
 *       movieName:
 *         type: string
 *         description: The name of the movie
 *       premiereDate:
 *         type: string
 *         format: date
 *         description: The date of the movie
 *       category:
 *         type: string
 *         description: The category of the movie
 *       actors:
 *         type: array
 *         items:
 *            type: string
 *         description: The actors of the movie
 *       description:
 *         type: string
 *         description: The description of the movie
 *       director:
 *         type: string
 *         description: The director of the movie
 *       imageMovie:
 *         type: string
 *         description: The img of the movie
 *       likes:
 *         type: array
 *         items:
 *            type: string
 *         description: The list user like the movie
 *     required:
 *       - movieName
 *       - premiereDate
 *       - category
 *       - actors
 *       - director
 *       - description
 *       - imageMovie
 */

/**
 * @swagger
 * /movie:
 *   post:
 *     summary: Create a new movie
 *     description: Create a new movie using the provided data.
 *     tags:
 *       - Movie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       200:
 *         description: Successfully created a new movie.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Bad Request. Invalid data provided.
 *       500:
 *         description: Internal Server Error.
 */

router.post("/", createdMovieController);

/**
 * @swagger
 * /movie/{id}:
 *   put:
 *     summary: Update a movie by ID
 *     description: Update an existing movie using its ID and the provided data.
 *     tags:
 *       - Movie
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the movie to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       200:
 *         description: Successfully updated the movie.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie2'
 *       400:
 *         description: Bad Request. Invalid data provided.
 *       404:
 *         description: Movie not found.
 *       500:
 *         description: Internal Server Error.
 */

router.put("/:id", updatedMovieController);

/**
 * @swagger
 * /movie/{id}:
 *   delete:
 *     summary: Delete a movie by ID
 *     description: Delete an existing movie by its ID.
 *     tags:
 *       - Movie
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the movie to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Movie not found.
 *       500:
 *         description: Internal Server Error.
 */

router.delete("/:id", DeletedMovieController);

/**
 * @swagger
 * /movie/{id}:
 *   get:
 *     summary: Get a movie by ID
 *     description: Retrieve an existing movie by its ID.
 *     tags:
 *       - Movie
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the movie to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Movie not found.
 *       500:
 *         description: Internal Server Error.
 */

router.get("/:id", GetMovieController);

/**
 * @swagger
 * /movie:
 *   get:
 *     summary: Get all movies
 *     description: Retrieve a list of all movies.
 *     tags:
 *       - Movie
 *     responses:
 *       200:
 *         description: Movies retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       500:
 *         description: Internal Server Error.
 */

router.get("/", GetAllMovieController);

/**
 * @swagger
 * /movie/toggle-like/{movieId}/{userId}:
 *   patch:
 *     summary: Toggle like status for a movie by a user
 *     description: Toggle the like status for a movie by a user.
 *     tags:
 *       - Movie
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         description: The ID of the movie to update like status.
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user performing the action.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Like status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Movie or user not found.
 *       500:
 *         description: Internal Server Error.
 */
router.patch("/toggle-like/:movieId/:userId", UpdateLikeMovieController);

export default router;
