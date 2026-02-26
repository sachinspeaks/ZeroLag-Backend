import { Server, Socket } from "socket.io";

export function initSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("Client connected:", socket.id);

    socket.on("message", (data: string) => {
      console.log("Message received:", data);
      socket.emit("message", `Echo: ${data}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}
