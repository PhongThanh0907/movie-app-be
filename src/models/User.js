import mongoose from "mongoose";
import crypto from "crypto";
export const emailValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: [true, "Email is required!"],
      unique: true,
      min: [6, "Email must be at least 6 characters"],
      max: [50, "Email must be less then 50 characters"],
      match: [emailValid, "Please add a valid email"],
    },
    birthDay: {
      type: String,
    },
    gender: {
      type: String,
    },
    password: {
      type: String,
      require: [true, "Password is required!"],
      min: [4, "Password must be at least 6 characters"],
      max: [20, "Password must be less then 50 characters"],
    },
    mobile: {
      type: String,
      // required: [true, "Mobile is required!"],
      // unique: true,
      // min: [10, "Mobile must be least 10 number"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
      require: true,
    },
    address: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    passwordChangedAt: {
      type: String,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: String,
    },
    registerToken: {
      type: String,
    },
    favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
  },
  {
    timestamps: true,
  }
);
UserSchema.methods = {
  createPasswordChangedToken: function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
    return resetToken;
  },
};

export default mongoose.model("User", UserSchema);
