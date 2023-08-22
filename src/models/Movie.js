import mongoose from "mongoose";

const MovieSchema = new mongoose.Schema(
  {
    movieName: {
      type: String,
      require: true,
    },
    premiereDate: {
      type: Date,
      require: true,
    },
    category: {
      type: String,
      require: true,
    },
    director: {
      type: String,
      require: true,
    },
    actors: {
      type: [String],
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    imageMovie: {
      type: String,
      require: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("Movie", MovieSchema);
