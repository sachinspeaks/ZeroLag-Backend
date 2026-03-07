import express from "express";
import type { Application } from "express";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import type { appDataType } from "./types/globalTypes.js";

const app: Application = express();
export const professionalAppointments: appDataType[] = [];
app.set("professionalAppointments", professionalAppointments);

app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

app.use("/api", routes);

app.use(errorHandler);

export default app;
