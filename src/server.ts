import https from "https";
import app from "./app.js";
import { Server } from "socket.io";
import { initSocket } from "./socket/index.js";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const key = fs.readFileSync("./certs/localhost+2-key.pem");
const cert = fs.readFileSync("./certs/localhost+2.pem");

const server = https.createServer({ key, cert }, app);
const PORT = process.env.PORT;

// Attach Socket.IO to HTTP server
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Initialize socket handlers
initSocket(io);

// Start server
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
