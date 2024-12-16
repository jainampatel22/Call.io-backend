import { Socket } from "socket.io"
import { v4 as UUIDv4 } from "uuid"
import IRoomParams from "../interfaces/IRoomParams"
const rooms :Record<string,string[]>={}

const roomHandler = (socket: Socket) => {

    const createRoom = () => {
        const roomId = UUIDv4()
        socket.join(roomId)
        rooms[roomId]=[]
        socket.emit('room-created', { roomId })
        console.log("room created with id",roomId)
    }
    const joinRoom = ({roomId,peerId}:IRoomParams) => {
        if(rooms[roomId]){
            console.log("user joined room with roomid",roomId,"with peer id as ",peerId)
            rooms[roomId].push(peerId)
            socket.join(roomId)

            socket.emit('get-users',{
                roomId,
                participants:rooms[roomId]
            })
        }
       
    }
    socket.on("create-room",createRoom)
    socket.on("join-room",joinRoom)
}
export default roomHandler