import { Server } from 'socket.io';
import { Message } from './models/Message.js';

export function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // In production, replace with your specific frontend URL
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', async (socket) => {
    console.log('A user connected:', socket.id);

    // 1. Fetch and send chat history to the newly connected user
    try {
      const history = await Message.find().sort({ timestamp: 1 }).limit(50);
      socket.emit('chat-history', history);
    } catch (err) {
      console.error('Error fetching history:', err);
    }

    // 2. Listen for incoming messages from clients
    socket.on('send-message', async (data) => {
      const { sender, text } = data;
      
      // Save message to MongoDB
      const newMessage = new Message({ sender, text });
      await newMessage.save();

      // Broadcast the message to EVERYONE (including the sender)
      io.emit('receive-message', newMessage);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
}