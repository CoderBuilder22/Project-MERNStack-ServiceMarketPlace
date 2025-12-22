import express from 'express';
import connectDB from './config/db.js';
import AuthRouter from './routes/AuthRoutes.js';
import AdminRouter from './routes/AdminRoutes.js';
import ProviderRouter from './routes/ProviderRoutes.js';
import CustomerRouter from './routes/CustomerRoutes.js';
import ChatRouter from './routes/ChatRoutes.js';
import cors from "cors";
import http from 'http';
import { Server } from 'socket.io';
import Chat from './models/Chat.js';

const app = express();
const server = http.createServer(app);

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));


const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", async (data) => {
    const { sender, receiver, message } = data;

    try {
      const newMessage = new Chat({ sender, receiver, message });
      await newMessage.save();
      socket.to(receiver).emit("receive_message", data);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});


app.use('/api/auth', AuthRouter);
app.use('/api/admin', AdminRouter);
app.use('/api/provider', ProviderRouter);
app.use('/api/customer', CustomerRouter);
app.use('/api/chat', ChatRouter);
app.use('/images', express.static('public/images'));


server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  connectDB();
});


server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Please free the port before running the server.`);
    process.exit(1);
  } else {
    console.error(err);
    process.exit(1);
  }
});
