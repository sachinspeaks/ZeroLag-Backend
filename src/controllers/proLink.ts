import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../errors/appError.js";
import dotenv from "dotenv";
dotenv.config();

const secretHash = process.env.SECRET_HASH;

export const ProLinkController = (req: Request, res: Response) => {
  const userData = {
    fullName: "Peter Chan, J.D.",
    proId: 1234,
  };
  if (!secretHash) {
    console.log("SECRET_HASH is missing from env file.");
    throw new BadRequestError();
  }
  const token = jwt.sign(userData, secretHash, {
    algorithm: "HS256",
  });
  res.send(
    `<a href="https://localhost:3000/dashboard?token=${token}" target="_blank">Link Here</a>`,
  );
};
