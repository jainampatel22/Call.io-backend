"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const RoomHandler_1 = __importDefault(require("./handlers/RoomHandler"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true, // enable cookies or credentials, if necessary
}));
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173", // allow your frontend local URL for development
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true, // if you're using cookies or credentials in the request
    }
});
io.on("connection", (socket) => {
    console.log("New user connected");
    (0, RoomHandler_1.default)(socket); // pass the socket conn to the room handler for room creation and joining
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});
server.listen(8080, () => {
    console.log("server up");
});
