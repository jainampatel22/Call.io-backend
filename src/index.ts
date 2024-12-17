import express from "express";

import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import roomHandler from "./handlers/RoomHandler";


const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true, // enable cookies or credentials, if necessary
  }));
const server = http.createServer(app);

const io = new Server(server, {
  path: "/socket.io/", // Explicitly set the Socket.IO path
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true, // Enable compatibility with Socket.IO v3 clients
  pingTimeout: 60000, 
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