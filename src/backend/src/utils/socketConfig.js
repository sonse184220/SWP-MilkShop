import { Server } from 'socket.io';
import { chatService } from '../services/chatService.js';

export const configureSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('join session', async (sessionID) => {
            socket.join(sessionID);
            const messages = await chatService.getChatHistory(sessionID);
            socket.emit('chat history', messages);
        });

        socket.on('chat message', async (msg) => {
            const { sessionID, userId, message } = msg;

            try {
                const savedMessage = await chatService.saveMessage(sessionID, userId, message);
                io.to(sessionID).emit('chat message', savedMessage);
            } catch (error) {
                console.error('Error saving message:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
};
