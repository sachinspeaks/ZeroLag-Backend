import type { Request, Response } from "express";

import jwt from "jsonwebtoken";
import { professionalAppointments } from "../app.js";
import { BadRequestError, InternalServerError } from "../errors/appError.js";
import dotenv from "dotenv";
dotenv.config();

const secretHash = process.env.SECRET_HASH;

export const AppLinkController = (req: Request, res: Response) => {
  const appData = professionalAppointments[0];
  if (!appData) {
    throw new InternalServerError(
      "Getting professionalAppointments array empty.",
    );
  }
  if (!secretHash) throw new BadRequestError();
  const token = jwt.sign(appData, secretHash, { algorithm: "HS256" });
  res.send("https://localhost:3000/join-video?token=" + token);
};
