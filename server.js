import express from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import { initSocket } from './socket.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
// Replace with your local MongoDB URI or MongoDB Atlas URI
const MONGO_URI = 'mongodb://127.0.0.1:27017/support_chat'; 

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Create HTTP server and bind Socket.io
const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});