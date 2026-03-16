import type { Request, Response } from "express";

import jwt from "jsonwebtoken";
import { professionalAppointments } from "../app.js";
import { InternalServerError } from "../errors/appError.js";
const secretHash = "dkgfjhaer8tuq48tqu4qjwerfknq435q34**(*(";

export const AppLinkController = (req: Request, res: Response) => {
  const appData = professionalAppointments[0];
  if (!appData) {
    throw new InternalServerError(
      "Getting professionalAppointments array empty.",
    );
  }
  console.log("ye appt data jaa raha ", appData);
  const token = jwt.sign(appData, secretHash, { algorithm: "HS256" });
  res.send("https://localhost:3000/join-video?token=" + token);

  console.log("professional appointments ", professionalAppointments);
};
