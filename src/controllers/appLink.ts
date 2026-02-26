import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
const secretHash = "dkgfjhaer8tuq48tqu4qjwerfknq435q34**(*(";

export const AppLinkController = (req: Request, res: Response) => {
  const appData = {
    professionalsFullName: "Sachin",
    apptDate: new Date(),
  };
  const token = jwt.sign(appData, secretHash, { algorithm: "HS256" });
  res.send("https://localhost:3000/join-video?token=" + token);
};
