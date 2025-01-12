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
    credentials: true,
  }));
const server = http.createServer(app);

const io = new Server(server, {
  path: "/socket.io/", 
  cors: {
    origin: ["http://localhost:5173","https://io-call.onrender.com"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true, 
  pingTimeout: 60000, 
  });

io.on("connection", (socket) => {
    console.log("New user connected");
    roomHandler(socket);
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});
const keepAlive = () => {
  const url = 'https://call-io-backend-jvgm.onrender.com';
  setInterval(async () => {
    try {
      const response = await fetch(url);
      console.log('Keep-alive ping sent, status:', response.status);
    } catch (error) {
      console.error('Keep-alive ping failed:', error);
    }
  }, 840000); // 14 minutes
};

keepAlive();
server.listen(8080,()=>{
    console.log("server up")
})
export {io ,server}