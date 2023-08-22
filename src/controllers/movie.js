import asyncHandler from "express-async-handler";
import MovieModel from "../models/Movie.js";
import UserModel from "../models/User.js";

export const createdMovieController = asyncHandler(async (req, res) => {
  try {
    console.log(req.body);
    const movie = await MovieModel.create(req.body);
    return res.status(200).json(movie);
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to create movie: ${error.message}`);
  }
});

export const updatedMovieController = asyncHandler(async (req, res) => {
  try {
    const movie = await MovieModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    return res.status(200).json(movie);
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to update movie: ${error.message}`);
  }
});

export const DeletedMovieController = asyncHandler(async (req, res) => {
  try {
    await MovieModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      message: "Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to delete movie: ${error.message}`);
  }
});

export const GetMovieController = asyncHandler(async (req, res) => {
  try {
    const movie = await MovieModel.findById(req.params.id);
    if (!movie)
      return res.status(404).json({
        message: "Movie not found",
      });

    return res.status(200).json(movie);
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to get movie by Id: ${error.message}`);
  }
});

export const GetAllMovieController = asyncHandler(async (req, res) => {
  try {
    const movies = await MovieModel.find();

    return res.status(200).json(movies);
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to get movies: ${error.message}`);
  }
});

export const UpdateLikeMovieController = asyncHandler(async (req, res) => {
  const movieId = req.params.movieId;
  const userId = req.params.userId;
  try {
    const movie = await MovieModel.findById(movieId);
    const user = await UserModel.findById(userId);
    if (!movie || !user) {
      return res.status(404).json({ message: "Movie or user not found." });
    }

    const isLiked = user.favoriteMovies.includes(movieId);
    const likedIndex = movie.likes.indexOf(userId);

    if (likedIndex !== -1) {
      movie.likes.splice(likedIndex, 1);
    } else {
      movie.likes.push(userId);
    }

    if (isLiked) {
      user.favoriteMovies.pull(movieId);
    } else {
      user.favoriteMovies.push(movieId);
    }
    await movie.save();
    await user.save();
    res.json(user);
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to update like movie: ${error.message}`);
  }
});
