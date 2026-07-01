// Connect to the backend server
const socket = io('http://localhost:5000');

const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');

// Generate a random sender name for testing purposes
const username = 'User_' + Math.floor(Math.random() * 9000 + 1000);

// Helper function to render a message on screen
function appendMessage(data) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  
  // Apply specific styles if the message is from yourself vs others
  if (data.sender === username) {
    messageElement.classList.add('msg-self');
    messageElement.textContent = data.text;
  } else {
    messageElement.classList.add('msg-other');
    messageElement.textContent = `${data.sender}: ${data.text}`;
  }

  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to bottom
}

// 1. Receive chat history upon connection
socket.on('chat-history', (history) => {
  chatBox.innerHTML = ''; // Clear fallback states
  history.forEach(msg => appendMessage(msg));
});

// 2. Receive new incoming messages in real-time
socket.on('receive-message', (data) => {
  appendMessage(data);
});

// 3. Handle sending messages
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const text = messageInput.value.trim();
  if (!text) return;

  // Emit event to server
  socket.emit('send-message', {
    sender: username,
    text: text
  });

  messageInput.value = ''; // Clear input field
});