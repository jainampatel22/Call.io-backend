import express from "express"
import http from "http"
import { Server } from "socket.io"
import cors from "cors"
import roomHandler from "./handlers/RoomHandler"
const app = express()
app.use(cors())
const server = http.createServer(app)
const io = new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
})
io.on('connection',(socket)=>{
console.log("user connected")
    roomHandler(socket)
    socket.on('disconnect',()=>{
        console.log("user disconnect")
    })
})

server.listen(8080,()=>{
    console.log("server is up")
})