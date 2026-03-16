import { Server, Socket } from "socket.io";
import app from "../app.js";
import type {
  appDataType,
  connectedClientType,
  connectedProfessionalType,
  offerType,
} from "../types/globalTypes.js";
import jwt from "jsonwebtoken";

const allKnownOffers: Record<string, offerType> = {};
const connectedProfessionals: connectedProfessionalType[] = [];
const connectedClients: connectedClientType[] = [];
const secretHash = process.env.SECRET_HASH;

export function initSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    if (!secretHash) {
      console.error("SECRET_HASH is missing from env file. Disconnecting.");
      socket.disconnect(true);
      return;
    }

    const token = socket.handshake.auth.token;
    if (!token || typeof token !== "string") {
      console.log("Token not valid.", token);
      socket.disconnect(true);
      return;
    }

    let decodedData: any;
    try {
      decodedData = jwt.verify(token, secretHash);
    } catch (error) {
      console.error("Socket auth failed:", error);
      socket.disconnect(true);
      return;
    }

    const { fullName, proId } = decodedData;
    if (proId) {
      // if there is proId means this is a professional not user/client

      //first check if client already exists if it does change its socket id else push the client.
      const connectedProfessional = connectedProfessionals.find(
        (p) => p.proId === proId,
      );
      if (!connectedProfessional)
        connectedProfessionals.push({ socketId: socket.id, fullName, proId });
      else connectedProfessional.socketId = socket.id;

      const professionalAppointments: appDataType[] = app.get(
        "professionalAppointments",
      );

      socket.emit(
        "apptData",
        professionalAppointments.filter(
          (pa) => pa.professionalsFullName === fullName,
        ),
      );

      //loop through all known offers and send out to the professional that just joined, the ones that belong to hin.
      for (const key in allKnownOffers) {
        if (allKnownOffers[key]?.professionalsFullName === fullName) {
          io.to(socket.id).emit("newOfferWaiting", allKnownOffers[key]);
        }
      }
    } else {
      const { professionalsFullName, uuid, clientName } = decodedData;

      //first check if client already exists if it does change its socket id else push the client.
      const clientExists = connectedClients.find((c) => c.uuid == uuid);
      if (clientExists) {
        clientExists.socketId = socket.id;
      } else {
        connectedClients.push({
          clientName,
          uuid,
          professionalMeetingWith: professionalsFullName,
          socketId: socket.id,
        });
      }

      const offerForThisClient = Object.values(allKnownOffers).find(
        (o: any) => o.uuid === uuid,
      );
      if (offerForThisClient) {
        io.to(socket.id).emit("answerToClient", offerForThisClient.answer);
      }
    }

    socket.on("newAnswer", ({ answer, uuid }) => {
      //received the answer from the client2(attorney) and now we have to emit it to client(user).
      const socketToSendTo = connectedClients.find((c) => c.uuid == uuid);
      if (socketToSendTo) {
        socket.to(socketToSendTo.socketId).emit("answerToClient", answer);
      }
      //update the offer in allknownoffers object
      const knownOffer = Object.values(allKnownOffers).find(
        (o: any) => o.uuid === uuid,
      );
      if (knownOffer) {
        knownOffer.answer = answer;
      }
    });

    socket.on("newOffer", ({ offer, apptInfo }) => {
      console.log(apptInfo);
      allKnownOffers[apptInfo.professionalsFullName] = {
        ...apptInfo,
        offer,
        offererIceCandidates: [],
        answer: null,
        answererIceCandidates: [],
      };

      const professionalAppointments: appDataType[] = app.get(
        "professionalAppointments",
      );
      const pa = professionalAppointments.find(
        (pa) => pa.uuid === apptInfo.uuid,
      );
      if (pa) pa.waiting = true; //we find the particular appointment where useris waiting and we then send the notification(.waiting=true)

      // dont emit this to everyone coz we only want this to go to our professional
      const professional = connectedProfessionals.find(
        (cp) => cp.fullName === apptInfo.professionalsFullName,
      );
      if (professional) {
        const socketId = professional?.socketId;
        socket
          .to(socketId)
          .emit(
            "newOfferWaiting",
            allKnownOffers[apptInfo.professionalsFullName],
          );
        //send the updated info with the new waiting
        socket.to(socketId).emit(
          "apptData",
          professionalAppointments.filter(
            (p) => p.professionalsFullName === apptInfo.professionalsFullName,
          ),
        );
      }
    });

    socket.on("getIce", (uuid, who, ackFunc) => {
      const offer = allKnownOffers[uuid];
      let iceCandidates = [];
      if (who == "client") {
        iceCandidates = offer?.offererIceCandidates;
      } else if (who == "professional") {
        iceCandidates = offer?.answererIceCandidates;
      }
      ackFunc(iceCandidates);
    });

    socket.on("iceToServer", ({ who, candidate, uuid }) => {
      const offerToUpdate = allKnownOffers[uuid];
      if (who === "client") {
        //this means the client sent the ice candidate
        offerToUpdate?.offererIceCandidates.push(candidate);
        const socketToSendTo = connectedProfessionals.find(
          (cp) => cp.fullName === decodedData.professionalsFullName,
        );
        if (socketToSendTo) {
          socket.to(socketToSendTo.socketId).emit("iceToClient", candidate);
        }
      } else {
        offerToUpdate?.answererIceCandidates.push(candidate);
        const socketToSendTo = connectedClients.find((cc) => cc.uuid === uuid);
        if (socketToSendTo) {
          socket
            .to(socketToSendTo.socketId)
            .emit("iceToProfessional", candidate);
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}
