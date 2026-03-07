import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import jwt from "jsonwebtoken";
import type { appDataType } from "../types/globalTypes.js";
import { professionalAppointments } from "../app.js";
const secretHash = "dkgfjhaer8tuq48tqu4qjwerfknq435q34**(*(";

export const AppLinkController = (req: Request, res: Response) => {
  const uuid = uuidv4(); //unqiue id/primary key for db

  const appData: appDataType = {
    professionalsFullName: "Sachin",
    apptDate: new Date(),
    uuid,
  };

  professionalAppointments.push(appData);

  const token = jwt.sign(appData, secretHash, { algorithm: "HS256" });
  res.send("https://localhost:3000/join-video?token=" + token);

  console.log("professional appointments ", professionalAppointments);
};
