import express from "express";
import {Server} from 'socket.io'
import { createServer } from 'node:http';
import cors from 'cors'

const port = 3000;

const app = express();
const server = createServer(app);

const io = new Server(server,{
    cors:{
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    }
});

app.use(cors());

app.get("/", (req,res)=>{
    res.send("Socket.io Messaging App Sever");
});

io.on("connection", (socket)=>{
    console.log("User Connected with id:", socket.id);

    // socket.emit("welcome", `Welcome to the server`);
    // socket.broadcast.emit("welcome", `${socket.id} has joined the server`);

    socket.on("message", (data)=>{
        console.log(data);
        // io.emit("recieve-message", data);
        // socket.broadcast.emit("recieve-message",data);
        io.to(data.room).emit("recieve-message", data.message);
    });

    socket.on("join-hall", (hall)=>{
        socket.join(hall);
        console.log(`${socket.id} joined ${hall}`)
    });

    socket.on("disconnect",(data)=>{
        console.log(`${socket.id} disconnected`);
    });

});

server.listen(port, ()=>{
    console.log(`Server is running on port ${port}`); 
});