"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.io = void 0;
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const RoomHandler_1 = __importDefault(require("./handlers/RoomHandler"));
const PORT = process.env.PORT || 8080;
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "https://call-io-frontend.onrender.com"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
}));
const server = http_1.default.createServer(app);
exports.server = server;
const io = new socket_io_1.Server(server, {
    path: "/socket.io/",
    cors: {
        origin: ["https://call-io-frontend.vercel.app"],
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true,
    },
    transports: ['websocket', 'polling'],
    allowEIO3: true,
    pingTimeout: 60000,
});
exports.io = io;
io.on("connection", (socket) => {
    console.log("New user connected");
    (0, RoomHandler_1.default)(socket);
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});
const keepAlive = () => {
    const url = 'https://call-io-backend-jvgm.onrender.com';
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield fetch(url);
            console.log('Keep-alive ping sent, status:', response.status);
        }
        catch (error) {
            console.error('Keep-alive ping failed:', error);
        }
    }), 840000); // 14 minutes
};
keepAlive();
server.listen(PORT, () => {
    console.log("server up");
});
