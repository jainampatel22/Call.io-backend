"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const rooms = {};
const roomHandler = (socket) => {
    const createRoom = () => {
        const roomId = (0, uuid_1.v4)();
        socket.join(roomId);
        rooms[roomId] = [];
        socket.emit('room-created', { roomId });
        console.log("room created with id", roomId);
    };
    const joinRoom = ({ roomId, peerId }) => {
        if (rooms[roomId]) {
            console.log("user joined room with roomid", roomId, "with peer id as ", peerId);
            rooms[roomId].push(peerId);
            socket.join(roomId);
            socket.emit('get-users', {
                roomId,
                participants: rooms[roomId]
            });
        }
    };
    socket.on("create-room", createRoom);
    socket.on("join-room", joinRoom);
};
exports.default = roomHandler;
