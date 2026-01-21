# Real-Time Chat Application

A fully functional real-time chat application built with **Node.js**, **Express**, and **Socket.IO**. This application enables multiple users to connect, send messages, see online users, and experience real-time typing indicators.

## Features

✨ **Core Features:**
- Real-time messaging with WebSocket (Socket.IO)
- User join/leave notifications
- Online users list with live updates
- Typing indicators (shows when someone is typing)
- Responsive and modern UI
- Message timestamps
- User-friendly interface

🎯 **Technical Features:**
- Cross-origin resource sharing (CORS) enabled
- Auto-scrolling to latest messages
- System notifications for user events
- HTML escaping for security
- Clean and organized code structure

## Project Structure

```
chat-app/
├── server.js              # Express server with Socket.IO
├── package.json           # Project dependencies
└── public/
    ├── index.html         # Frontend HTML
    ├── style.css          # Styling
    └── client.js          # Client-side Socket.IO logic
```

## Installation

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Setup Steps

1. **Navigate to the project directory:**
   ```bash
   cd "C:\Users\intel\html-practical\2nd day\Contacts\Desktop\task"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   - Navigate to `http://localhost:3000`
   - Enter a username and click "Join Chat"
   - Open multiple tabs/windows to test multi-user chat

## Usage

### Joining the Chat
1. Enter your username in the join screen
2. Click "Join Chat" or press Enter
3. Your username appears in the Online Users list

### Sending Messages
1. Type your message in the input field
2. Click "Send" or press Enter
3. Message appears in the chat with timestamp

### Features in Action
- **Typing Indicator**: Start typing and other users will see "User is typing..."
- **User List**: See all connected users in the left panel
- **System Notifications**: Get notified when users join or leave
- **User Count**: See total number of online users in the header

### Leaving the Chat
- Click the "Leave Chat" button to disconnect
- You'll be returned to the join screen

## Server Events

### Socket.IO Events

**Client → Server:**
- `join` - User joins with username
- `send-message` - User sends a message
- `typing` - User typing status (true/false)

**Server → All Clients:**
- `user-joined` - New user joined
- `receive-message` - New message broadcast
- `user-typing` - User typing indicator
- `user-left` - User disconnected

## Customization

### Change Server Port
Edit `server.js` and modify:
```javascript
const PORT = process.env.PORT || 3000;
```

### Modify Styling
Edit `public/style.css` to customize colors, fonts, and layout

### Add New Features
Edit `server.js` and `public/client.js` to add:
- Private messaging
- Rooms/channels
- User authentication
- Message persistence (database)
- File sharing
- Video/audio calls

## Browser Support

- Chrome 50+
- Firefox 45+
- Safari 10+
- Edge 15+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Dependencies

- **express** (4.18.2) - Web framework
- **socket.io** (4.5.4) - Real-time communication
- **nodemon** (2.0.20) - Development auto-reload (dev only)

## Performance Tips

- The app handles multiple concurrent connections efficiently
- Auto-scrolling ensures no message is missed
- Typing indicators auto-clear after 3 seconds of inactivity
- Responsive design optimizes for mobile devices

## Troubleshooting

### Port Already in Use
```bash
# Windows: Find and kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port
PORT=3001 npm start
```

### Connection Issues
- Ensure the server is running
- Check browser console for errors (F12)
- Verify port 3000 is accessible
- Check firewall settings

### CORS Errors
The server is configured with CORS enabled. If issues persist, verify Socket.IO CORS settings in `server.js`.

## Development

### Adding Rooms Feature
```javascript
// In server.js - emit to specific room
io.to(roomName).emit('receive-message', message);

// In client.js - join room
socket.emit('join-room', { username, room });
```

### Database Integration
Replace in-memory users object with database calls:
```javascript
// const users = {}; // Remove this
// Use: const users = await db.getUsers();
```

## Security Notes

- User inputs are HTML-escaped to prevent XSS
- No authentication implemented (add for production)
- CORS allows all origins (restrict for production)
- No message persistence (add database for production)

## Future Enhancements

- [ ] User authentication
- [ ] Message history (database)
- [ ] Private/direct messages
- [ ] Chat rooms
- [ ] User profiles
- [ ] Message reactions
- [ ] File uploads
- [ ] Admin controls

## License

ISC

## Support

For issues or questions, check the browser console and server logs for error messages.

---

**Created:** January 21, 2026  
**Version:** 1.0.0
