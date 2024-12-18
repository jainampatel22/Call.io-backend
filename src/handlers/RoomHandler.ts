import { Socket } from "socket.io";
import { v4 as UUIDv4 } from "uuid";
import IRoomParams from "../interfaces/IRoomParams";

// the below map stores for a room what all peers have joined
const rooms: Record<string, string[]> = {};

const roomHandler = (socket: Socket) => {
    const createRoom = () => {
        // Generate a unique room ID
        const roomId = UUIDv4();

        // Add the new room to the rooms array
        rooms[roomId] = []; // This is the key fix you pointed out

        // Make the socket connection enter the new room
        socket.join(roomId);

        // Emit an event that the room has been created
        socket.emit("room-created", { roomId });
        console.log("Room created with id", roomId);
    };

    const joinRoom = ({ roomId, peerId, username }: IRoomParams & { username?: string }) => {
        // Validate room existence
        if (!rooms[roomId]) {
          socket.emit("room-error", { message: "Room does not exist" });
          return;
        }
    
        // Add participant to room
        rooms[roomId].push(peerId);
        socket.join(roomId);
    
        console.log(`User ${peerId} joined room ${roomId}`);
    
        // Broadcast to other room participants
        socket.to(roomId).emit("user-joined", { 
          peerId, 
          username 
        });
    
        // Confirm room join to the joining user
        socket.emit("room-joined", { roomId });
    
        // Send current participants to the new user
        socket.emit("get-users", {
          roomId,
          participants: rooms[roomId]
        });
    };

    // Socket event listeners
    socket.on("create-room", createRoom);
    socket.on("joined-room", joinRoom);
};

export default roomHandler;