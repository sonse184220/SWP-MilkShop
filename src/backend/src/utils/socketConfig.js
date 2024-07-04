// utils/socketConfig.js
import { Server } from 'socket.io';
import { ChatService } from '../services/chatService.js';

export function configureSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    const chatService = new ChatService();

    io.on('connection', (socket) => {
        console.log('a user connected:', socket.id);

        socket.on('join session', (sessionID) => {
            socket.join(sessionID);
        });

        socket.on('chat message', async ({ sessionID, userId, message }) => {
            await chatService.addChatMessage(sessionID, userId, message);
            io.to(sessionID).emit('chat message', { userId, message, timestamp: new Date() });
        });

        socket.on('disconnect', () => {
            console.log('user disconnected:', socket.id);
        });
    });

    return io;
}
