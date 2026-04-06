import catchAsyncError from "../middleware/catchAsyncError.js";
import User from "../model/user.js";
import { getResetPasswordTemplate } from "../utils/emailTemplate.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendEmail from "../utils/sendEmail.js";
import sendToken from "../utils/sendToken.js";
import crypto from "crypto";
// Register user => /api/v1/register
export const registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
  });
  sendToken(user, 201, res);
});

// Login user => /api/v1/register
export const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }

  // Find user in the database
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  //check password is correct
  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

//Logout user => /api/v1/logout
export const logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    message: "Logged out",
  });
});

//Forgot password =>  /api/v1/password/forgot
export const forgotPassword = catchAsyncError(async (req, res, next) => {
  //Find user in the database
  const user = await User.findOne({ email: req.body.email });
  console.log(user, "user");
  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  //Get reset password token
  const resetToken = await user.getResetPasswordToken();
  await user.save();

  //Create reset password url

  const resetUrl = `${process.env.FRONTEND_URL}/api/v1/password/reset/${resetToken}`;

  const message = getResetPasswordTemplate(user?.name, resetUrl);

  try {
    await sendEmail({
      email: user.email,
      subject: "Shopit Password Recovery",
      message,
    });
    res.status(200).json({
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpired = undefined;

    await user.save();

    return next(new ErrorHandler(error?.message, 500));
  }
  // sendToken(user, 200, res);
});

//Reset password =>  /api/v1/password/reset/:token
export const resetPassword = catchAsyncError(async (req, res, next) => {
  //Hash the URL Token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpired: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Password reset token is invalid or has been expired",
        400,
      ),
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  //Set the new Password
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpired = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Get Current user profile => /api/v1/me

export const getUserProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req?.user?._id);

  res.status(200).json({
    user,
  });
});

//Update Password => /api/v1/password/update

export const updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req?.user?._id).select("+password");

  //check the previous user password
  const isPasswordMatch = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatch) {
    return next(new ErrorHandler("Old Password is incorrect", 400));
  }

  user.password = req.body.password;
  user.save();

  res.status(200).json({
    success: true,
  });
});

//Update User Profile => /api/v1/me/update
export const updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserUpdate = {
    nmae: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user._id, newUserUpdate, {
    new: true,
  });

  res.status(200).json({
    user,
  });
});

// Get all Users - ADMIN => /api/v1/amdin/users
export const getAllUser = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    users,
  });
});

export const getUserDetais = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler(`User not found id: ${req.params.id}`, 400));
  }
  res.status(200).json({
    user,
  });
});

// Update User Details - ADMIN => /api/v1/users/:id
export const updateUser = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
  });

  res.status(200).json({
    user,
  });
});

// Delete user - ADMIN => /api/v1/admin/users/:id
export const deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User not found with id: ${req.params.id}`, 404),
    );
  }

  //TODO - Remove user avatar from cludnary

  await user.deleteOne();

  res.status(200).json({
    success: true,
  });
});
