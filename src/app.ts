import express from "express";
import type { Application } from "express";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import type { appDataType } from "./types/globalTypes.js";
import dotenv from "dotenv";
dotenv.config();

const app: Application = express();
export const professionalAppointments: appDataType[] = [
  {
    //usually this will come from db/file/api (persistent and to be fetched on start of server.)
    professionalsFullName: "Peter Chan, J.D.",
    apptDate: Date.now() + 500000,
    uuid: 1,
    clientName: "Jim Jones",
    waiting: false,
  },
  {
    professionalsFullName: "Peter Chan, J.D.",
    apptDate: Date.now() - 2000000,
    uuid: 2, // uuid:uuidv4(),
    clientName: "Akash Patel",
    waiting: false,
  },
  {
    professionalsFullName: "Peter Chan, J.D.",
    apptDate: Date.now() + 10000000,
    uuid: 3, //uuid:uuidv4(),
    clientName: "Mike Williams",
    waiting: false,
  },
];
app.set("professionalAppointments", professionalAppointments);

app.use(
  cors({
    origin: [
      "https://geekysachin.com",
      "https://zerolag.geekysachin.com",
      "https://www.zerolag.geekysachin.com",
    ],
  }),
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

app.use("/api", routes);

app.use(errorHandler);

export default app;
