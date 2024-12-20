import { Socket } from "socket.io";
import { v4 as UUIDv4 } from "uuid";
import IRoomParams from "../interfaces/IRoomParams";

interface Participant {
    peerId: string;
    username: string;
  }
const rooms : Record<string, Participant[]> = {};

const roomHandler = (socket: Socket) => {



    const createRoom = ({username}:{username:string}) => {
       const roomId = UUIDv4();

         socket.join(roomId);

        rooms[roomId] = [];

           socket.emit("room-created", { roomId});
        console.log("Room created with id", roomId,username);
    };


    const joinedRoom = ({ roomId, peerId, username }: IRoomParams & { username: string }) => {
        console.log("joined room called", rooms, roomId, peerId);
        if(rooms[roomId]) {
             console.log("New user has joined room", roomId, "with peer id as", peerId);
               rooms[roomId].push({peerId,username})
            console.log("added peer to room", rooms);
            socket.join(roomId); 
            socket.on("ready", ({username}:{username:string}) => {
                        socket.to(roomId).emit("user-joined", {peerId,username}); 
            })

             socket.emit("get-users", {
                roomId,
                participants: rooms[roomId]
            });
        }
    };

     socket.on("create-room", createRoom);
    socket.on("joined-room", joinedRoom);


};

export default roomHandler;