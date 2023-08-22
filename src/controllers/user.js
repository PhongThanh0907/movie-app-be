import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import {
  generateRefreshToken,
  generateAccessToken,
} from "../middlewares/verifyToken.js";
import UserModel from "../models/User.js";

export const registerController = asyncHandler(async (req, res) => {
  const { email, password, userName } = req.body;
  if ((!email, !password, !userName))
    return res.status(400).json({
      message: "Username, password, email are required.",
    });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const registeredUser = await UserModel.findOne({ email });
    if (registeredUser)
      return res.status(400).json({
        message: "Email already exists",
      });

    const newUser = await UserModel.create({
      ...req.body,
      password: hashedPassword,
    });

    if (!newUser) throw new Error("User not create");

    return res.status(200).json({
      ...newUser._doc,
      token: generateAccessToken({
        _id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      }),
    });
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to create user: ${error.message}`);
  }
});

export const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({
      message: "Email and password are required.",
    });

  try {
    const response = await UserModel.findOne({ email });
    if (!response)
      return res.status(404).json({
        message: "Invalid email",
      });

    const isPasswordValid = await bcrypt.compare(password, response.password);
    if (!isPasswordValid)
      return res.status(400).json({
        message: "Incorrect password",
      });

    if (response && isPasswordValid) {
      const { password, isAdmin, refreshToken, ...userData } =
        response.toObject();

      const accessToken = generateAccessToken({
        _id: response._id,
        userName: response.userName,
        email: response.email,
        isAdmin: response.isAdmin,
      });

      const newRefreshToken = generateRefreshToken(response._id);

      await UserModel.findByIdAndUpdate(
        response._id,
        { refreshToken: newRefreshToken },
        { new: true }
      );

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        userData,
        accessToken,
      });
    }
  } catch (error) {
    throw new Error(`Failed to login user: ${error.message}`);
  }
});

export const getUsersController = asyncHandler(async (req, res) => {
  try {
    const users = await UserModel.find();
    if (!users)
      return res.status(404).json({
        message: "Users not found",
      });

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to get users: ${error.message}`);
  }
});

export const getUserController = asyncHandler(async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user)
      return res.status(404).json({
        message: "Users not found",
      });

    return res.status(200).json(user);
  } catch (error) {
    throw new Error(`Failed to get user: ${error.message}`);
  }
});

export const deleteUserController = asyncHandler(async (req, res) => {
  try {
    await UserModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      message: "Deleted successfully",
    });
  } catch (error) {
    throw new Error(`Failed to deleted user: ${error.message}`);
  }
});

export const updateUserController = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  try {
    if (Object.keys(req.body).length === 0)
      return res.status(400).json({
        message: "Missing inputs",
      });

    const response = await UserModel.findByIdAndUpdate(_id, req.body, {
      new: true,
    });

    return res.status(200).json({
      success: response ? true : false,
      updatedUser: response ? response : "Some thing went wrong",
    });
  } catch (error) {
    throw new Error(`Failed to updated user: ${error.message}`);
  }
});

export const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  const response = await UserModel.findByIdAndUpdate(uid, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : "Some thing went wrong",
  });
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie && !cookie.refreshToken)
    return res.status(400).json({
      message: "No refreshtoken in cookies",
    });

  const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
  const response = await UserModel.findOne({
    _id: rs._id,
    refreshToken: cookie.refreshToken,
  });
  return res.status(200).json({
    success: response ? true : false,
    newAccessToken: response
      ? generateAccessToken(response._id, response.isAdmin)
      : "Refresh token not matched",
  });
});

export const logoutController = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie || !cookie.refreshToken)
    return res.status(400).json({
      message: "No refreshtoken in cookies",
    });
  await UserModel.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({
    success: true,
    message: "Logout successfully",
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({
      message: "Email is required",
    });
  const user = await UserModel.findOne({ email });
  if (!user)
    return res.status(404).json({
      message: "User not found",
    });
  const resetToken = user.createPasswordChangedToken();
  await user.save();
  const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.Link này sẽ hết hạn sau 15 phút kể từ bây giờ. <a href=resetpassword/${resetToken}>Click here</a>`;

  const data = {
    email,
    html,
  };
  const rs = await sendMail(data);

  return res.status(200).json({
    success: true,
    message: rs.response?.includes("OK")
      ? "Hãy check mail của bạn"
      : "Đã có lỗi, hãy thử lại sau",
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body;
  if (!password || !token) throw new Error("Missing inputs");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await UserModel.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() }, //Thời gian tồn tại 15 phút sau khi gửi email reset password
  });
  if (!user) throw new Error("Invalid reset token");
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  user.password = hashedPassword;
  user.passwordResetToken = undefined;
  user.passwordChangedAt = Date.now();
  user.passwordResetExpires = undefined;
  await user.save();
  return res.status(200).json({
    success: user ? true : false,
    message: user
      ? "Change password successfully"
      : "An error occurred, please try again",
  });
});
