import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

const app = express();
const server = http.createServer(app);
dotenv.config();

const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL },
});

io.on("connection", (socket) => {
  socket.on("chat added", (data) => {
    io.emit("update chats", { chatId: data.chatId });
  });
  socket.on("chat updated", (data) => {
    io.emit("update chats", { chatId: data.chatId });
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});

server.listen(8080, () => console.log("socket server running on 8080"));
