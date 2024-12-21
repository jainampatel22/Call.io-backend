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
        
        // Check if the room exists
        if (!rooms[roomId]) {
            socket.emit("room-error", { message: "Room does not exist" });
            return;
        }
    
        // Avoid adding duplicate participants
        const isAlreadyInRoom = rooms[roomId].some((participant) => participant.peerId === peerId);
        if (!isAlreadyInRoom) {
            console.log("New user has joined room", roomId, "with peer id as", peerId);
            rooms[roomId].push({ peerId, username });
        }
    
        console.log("Added peer to room", rooms);
    
        // Notify other participants about the new user
        socket.join(roomId);
        socket.to(roomId).emit("user-joined", { peerId, username });
    
        // Emit updated participant list to the joining client
        socket.emit("get-users", {
            roomId,
            participants: rooms[roomId],
        });
    
        // Send a 'room-joined' event to the client to confirm the join
        socket.emit("room-joined", { roomId });
    };
    

     socket.on("create-room", createRoom);
    socket.on("join-room", joinedRoom);


};

export default roomHandler;