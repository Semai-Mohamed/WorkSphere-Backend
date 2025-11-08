/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// client.js
const { io } = require('socket.io-client');

const socket = io('http://localhost:80/freelancer-client');

socket.emit('joinConversation', 1);

socket.on('newMessage', (msg) => {
  console.log('New message:', msg);
});

socket.emit('sendMessage', {
  conversationId: 1,
  content: 'Hello from Node client!',
  senderId: 1,
  participantId: 2,
});

socket.on('typing', (data) => {
  console.log(`${data.userId} is typing...`);
});
