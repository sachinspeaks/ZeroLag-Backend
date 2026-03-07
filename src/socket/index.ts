import { Server, Socket } from "socket.io";
import app from "../app.js";

interface offerType {
  uniqueId: string;
  offer: any;
  professionalFullName: string;
  clientName: string;
  apptDate: Date;
  offererIceCandidates: any;
  answer: any;
  answererIceCandidates: any;
}

// const allKnownOffers: offerType = {};

export function initSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("Client connected:", socket.id);

    socket.on("message", (data: string) => {
      console.log("Message received:", data);
      socket.emit("message", `Echo: ${data}`);
    });

    socket.on("newOffer", (offer, apptInfo) => {});

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}
