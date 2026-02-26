import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError.js";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Unknown / programming errors
  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
