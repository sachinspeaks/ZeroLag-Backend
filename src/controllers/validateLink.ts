import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../errors/appError.js";
import dotenv from "dotenv";
dotenv.config();

const secretHash = process.env.SECRET_HASH;

//This controller validates the token sent by the client when they try to join a video session. It checks if the token is present and valid, and if so, it decodes the token and sends the decoded data back to the client. If the token is invalid or not present, it throws a BadRequestError.
export const ValidateLinkController = (req: Request, res: Response) => {
  const token = req.body.token;
  if (!token || typeof token !== "string")
    throw new BadRequestError("Token not valid.");
  try {
    if (!secretHash) {
      console.log("SECRET_HASH is missing from env file.");
      throw new BadRequestError();
    }
    const decodedData = jwt.verify(token, secretHash);
    res.json(decodedData);
  } catch (error) {
    console.error("Error validating token:", error);
    throw new BadRequestError("Token not valid.");
  }
};
