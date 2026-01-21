// Simple Chat Application Client
console.log('Client script loaded');

const socket = io();
let currentUsername = '';

// DOM Elements
const joinScreen = document.getElementById('join-screen');
const chatScreen = document.getElementById('chat-screen');
const usernameInput = document.getElementById('username-input');
const joinBtn = document.getElementById('join-btn');
const leaveBtn = document.getElementById('leave-btn');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const messagesDiv = document.getElementById('messages');
const usersList = document.getElementById('users-list');
const userCount = document.getElementById('user-count');
const typingIndicator = document.getElementById('typing-indicator');

console.log('DOM Elements loaded:', { joinScreen, chatScreen, joinBtn });

// Join Chat Handler
joinBtn.addEventListener('click', function() {
    console.log('Join button clicked');
    const username = usernameInput.value.trim();
    
    if (username === '') {
        alert('Please enter a username');
        return;
    }

    console.log('Joining with username:', username);
    currentUsername = username;
    socket.emit('join', username);
    
    // Switch screens
    joinScreen.classList.remove('active');
    chatScreen.classList.add('active');
    messageInput.focus();
});

// Enter key on username input
usernameInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        joinBtn.click();
    }
});

// Send Message Handler
sendBtn.addEventListener('click', function() {
    console.log('Send button clicked');
    const message = messageInput.value.trim();
    
    if (message === '') return;

    console.log('Sending message:', message);
    socket.emit('send-message', { message: message });
    messageInput.value = '';
});

// Enter key on message input
messageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});

// Typing indicator
let typingTimeout;
messageInput.addEventListener('input', function() {
    socket.emit('typing', { isTyping: true });
    
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        socket.emit('typing', { isTyping: false });
    }, 3000);
});

// Leave Chat Handler
leaveBtn.addEventListener('click', function() {
    console.log('Leave button clicked');
    socket.disconnect();
    currentUsername = '';
    messagesDiv.innerHTML = '';
    usersList.innerHTML = '';
    joinScreen.classList.add('active');
    chatScreen.classList.remove('active');
    usernameInput.value = '';
    usernameInput.focus();
});

// Socket Events
socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('user-joined', (data) => {
    console.log('User joined event received:', data);
    updateUsersList(data.users);
    updateUserCount(data.userCount);
    
    if (data.username !== currentUsername) {
        addSystemMessage(`${data.username} joined the chat`);
    }
});

socket.on('receive-message', (message) => {
    console.log('Message received:', message);
    displayMessage(message);
});

socket.on('user-typing', (data) => {
    console.log('Typing indicator:', data);
    if (data.isTyping) {
        showTypingIndicator(data.username);
    } else {
        hideTypingIndicator(data.username);
    }
});

socket.on('user-left', (data) => {
    console.log('User left event received:', data);
    updateUsersList(data.users);
    updateUserCount(data.userCount);
    addSystemMessage(`${data.username} left the chat`);
});

socket.on('document-shared', (data) => {
    console.log('Document shared:', data);
    displayDocumentShare(data);
});

// Helper Functions
function displayMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.username === currentUsername ? 'own' : 'other'}`;
    
    const time = new Date(message.timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    messageDiv.innerHTML = `
        <div class="message-content">${escapeHtml(message.message)}</div>
        <div class="message-info">
            <strong>${escapeHtml(message.username)}</strong> • ${time}
        </div>
    `;
    
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function displayDocumentShare(data) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${data.from === currentUsername ? 'own' : 'other'}`;
    
    const time = new Date(data.timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    messageDiv.innerHTML = `
        <div class="message-content document-share">
            <div>📎 <strong>${escapeHtml(data.fileName)}</strong></div>
            <small>${formatFileSize(data.fileSize)}</small>
            <a href="${createBlobUrl(data.fileData, data.fileType)}" download="${data.fileName}" class="download-link">Download</a>
        </div>
        <div class="message-info">
            <strong>${escapeHtml(data.from)}</strong> • ${time}
        </div>
    `;
    
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function addSystemMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message system';
    messageDiv.style.justifyContent = 'center';
    messageDiv.style.marginTop = '20px';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.style.background = '#f0f0f0';
    messageContent.style.color = '#666';
    messageContent.style.fontSize = '12px';
    messageContent.textContent = text;
    
    messageDiv.appendChild(messageContent);
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function updateUsersList(users) {
    usersList.innerHTML = '';
    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.className = 'user-item';
        userDiv.textContent = user.username;
        usersList.appendChild(userDiv);
    });
}

function updateUserCount(count) {
    userCount.textContent = `Users: ${count}`;
}

function showTypingIndicator(username) {
    if (username !== currentUsername) {
        typingIndicator.innerHTML = `
            <div class="typing-indicator active">
                <strong>${escapeHtml(username)}</strong> is typing
                <span class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
            </div>
        `;
        typingIndicator.style.display = 'block';
    }
}

function hideTypingIndicator(username) {
    if (typingIndicator.textContent.includes(username)) {
        typingIndicator.innerHTML = '';
        typingIndicator.style.display = 'none';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function createBlobUrl(arrayBuffer, mimeType) {
    const blob = new Blob([arrayBuffer], { type: mimeType });
    return URL.createObjectURL(blob);
}

// Document sharing
const fileInput = document.getElementById('file-input');
const shareDocBtn = document.getElementById('share-doc-btn');

if (shareDocBtn) {
    shareDocBtn.addEventListener('click', () => {
        fileInput.click();
    });
}

if (fileInput) {
    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            socket.emit('share-document', {
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
                fileData: reader.result
            });
            addSystemMessage(`📎 ${escapeHtml(file.name)} shared (${formatFileSize(file.size)})`);
        };
        reader.readAsArrayBuffer(file);
        fileInput.value = '';
    });
}

console.log('Client script fully loaded and ready');
