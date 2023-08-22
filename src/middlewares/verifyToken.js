import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

import { JWT_SECRET } from "../utils/config.js";
import UserModel from "../models/User.js";

export const verifyAccessToken = asyncHandler(async (req, res, next) => {
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err)
        return res.status(401).json({
          success: false,
          mes: "Invalid access token",
        });
      req.user = decode;
      next();
    });
  } else {
    return res.status(401).json({
      success: false,
      mes: "Require authentication!",
    });
  }
});

export const generateAccessToken = (user) => {
  return jwt.sign(user, JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const generateRefreshToken = (uid) => {
  return jwt.sign({ _id: uid }, JWT_SECRET, { expiresIn: "7d" });
};

export const isAdmin = asyncHandler(async (req, res, next) => {
  const checkUser = await UserModel.findById(req.user._id);
  if (!checkUser.isAdmin)
    return res.status(401).json({
      success: false,
      mes: "You are not allowed",
    });
  next();
});
