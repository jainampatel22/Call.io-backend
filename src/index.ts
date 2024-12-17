import express from "express";

import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import roomHandler from "./handlers/RoomHandler";


const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",  // Frontend URL (can be * for testing)
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true,
      }
});

io.on("connection", (socket) => {
    console.log("New user connected");
    roomHandler(socket); // pass the socket conn to the room handler for room creation and joining
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

server.listen(8080,()=>{
    console.log("server up")
})