import ErrorHandler from "../utils/errorHandler.js";

export default (err, req, res, next) => {
  let error = {
    statusCode: err?.statusCode || 500,
    message: err?.message || "Internal server error",
  };

  //Handle Invalid Mongoose Id error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid:  ${err.path}`;
    error = new ErrorHandler(message, 404);
  }

  //Handle Mongoose Duplicate error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    error = new ErrorHandler(message, 404);
  }

  //Handle Wrong JWT Error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid. Try Again!`;
    error = new ErrorHandler(message, 404);
  }

  //Handle Expired JWT Error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is expired. Try Again!`;
    error = new ErrorHandler(message, 404);
  }

  //Handle Validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((value) => value.message);
    error = new ErrorHandler(message, 400);
  }

  if (process.env.NODE_ENV === "development") {
    res.status(error.statusCode).json({
      message: error.message,
      error: err,
      stack: err?.stack,
    });
  } else {
    res.status(error.statusCode).json({
      message: error.message,
    });
  }
};
