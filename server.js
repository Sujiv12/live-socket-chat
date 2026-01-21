const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Store active users and messages
const users = new Map();
const messages = [];
const reactions = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  socket.on('user_joined', (data) => {
    users.set(socket.id, data.username);
    console.log(`${data.username} joined`);
    
    // Broadcast updated user list
    const userList = Array.from(users.values());
    io.emit('users_list', userList);
  });

  // Handle incoming messages
  socket.on('send_message', (data) => {
    console.log('Message from', data.username, ':', data.msg.substring(0, 50));
    messages.push(data);
    io.emit('receive_message', data);
  });

  // Handle typing indicator
  socket.on('user_typing', (data) => {
    socket.broadcast.emit('user_typing', data);
  });

  // Handle message delete
  socket.on('delete_message', (data) => {
    const index = messages.findIndex(m => m.id === data.id);
    if (index !== -1) {
      messages.splice(index, 1);
      io.emit('message_deleted', data);
    }
  });

  // Handle reactions
  socket.on('add_reaction', (data) => {
    const key = `${data.id}_${data.emoji}`;
    if (!reactions.has(key)) {
      reactions.set(key, 0);
    }
    reactions.set(key, reactions.get(key) + 1);
    
    io.emit('reaction_added', {
      id: data.id,
      emoji: data.emoji,
      count: reactions.get(key)
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    if (username) {
      users.delete(socket.id);
      console.log(`${username} disconnected`);
      
      const userList = Array.from(users.values());
      io.emit('users_list', userList);
    }
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Chat server is running on http://localhost:${PORT}`);
});
