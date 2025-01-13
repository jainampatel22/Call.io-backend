"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const rooms = {};
const roomHandler = (socket) => {
    const createRoom = ({ username }) => {
        const roomId = (0, uuid_1.v4)();
        socket.join(roomId);
        rooms[roomId] = [];
        socket.emit("room-created", { roomId });
        console.log("Room created with id", roomId, username);
    };
    const joinedRoom = ({ roomId, peerId, username }) => {
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
    socket.on('chat-message', ({ message, roomId }) => {
        socket.to(roomId).emit('chat-message', message);
    });
};
exports.default = roomHandler;
