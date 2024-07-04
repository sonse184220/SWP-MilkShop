import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const configureSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return next(new Error('Authentication error'));
            }
            socket.user = decoded;
            next();
        });
    });

    io.on('connection', (socket) => {
        console.log('a user connected:', socket.user);

        socket.on('join session', (sessionId) => {
            socket.join(sessionId);
        });

        socket.on('chat message', (msg) => {
            io.to(msg.sessionId).emit('chat message', msg);
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });

    return io;
};
