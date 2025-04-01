import { Server } from 'socket.io';

class SocketService {
    constructor(server) {
        if (!server) {
            throw new Error('HTTP server instance is required');
        }

        console.log('Initializing Socket.IO service...');
        
        this.io = new Server(server, {
            cors: {
                origin: process.env.REACT_APP_FRONTEND,
                methods: ["GET", "POST"],
                allowedHeaders: ["*"],
                credentials: true
            },
            allowEIO3: true,
            transports: ['polling', 'websocket']
        });

        // Lưu trữ online users
        this.onlineUsers = new Map();
        
        // Add connection status monitoring
        this.setupConnectionMonitoring();
        this.initializeSocketEvents();

        // Add this at the top of your SocketService constructor
        console.log('Socket.IO Server Configuration:', {
            cors: this.io.opts.cors,
            transports: this.io.opts.transports,
            path: this.io.path(),
            serverUrl: process.env.REACT_APP_FRONTEND
        });

        // Monitor middleware errors
        this.io.engine.on('connection_error', (err) => {
            console.error('Socket.IO connection error:', {
                type: err.type,
                message: err.message,
                context: err.context
            });
        });

        // Add detailed logging
        this.io.engine.on('initial_headers', (headers, req) => {
            console.log('Socket.IO initial headers:', {
                headers: Object.keys(headers),
                url: req.url,
                method: req.method
            });
        });
    }

    setupConnectionMonitoring() {
        // Monitor general Socket.IO server events
        this.io.engine.on('connection', (socket) => {
            console.log('Transport connection established:', socket.transport.name);
        });

        this.io.engine.on('initial_headers', (headers, req) => {
            console.log('Initial headers:', Object.keys(headers));
        });

        this.io.engine.on('headers', (headers, req) => {
            console.log('Headers:', Object.keys(headers));
        });
    }

    initializeSocketEvents() {
        this.io.on('connect_error', (err) => {
            console.error('Socket.IO connection error:', err);
        });

        this.io.on('connection', (socket) => {
            console.log('✅ New client connected - Socket ID:', socket.id);
            console.log('🔄 Current connections count:', this.io.engine.clientsCount);
            
            // Log connection details
            console.log('Connection details:', {
                transport: socket.conn.transport.name,
                headers: socket.handshake.headers,
                query: socket.handshake.query,
                address: socket.handshake.address
            });

            // Handle user login
            socket.on('user:join', (userId) => {
                this.onlineUsers.set(userId, socket.id);
                socket.join(`user:${userId}`);
                console.log(`👤 User ${userId} joined with socket ${socket.id}`);
                console.log('📊 Online users:', this.onlineUsers.size);
                
                // Acknowledge connection to client
                socket.emit('user:joined', {
                    status: 'success',
                    userId,
                    socketId: socket.id
                });
            });

            // Handle ping (for connection testing)
            socket.on('ping', (callback) => {
                if (callback && typeof callback === 'function') {
                    callback({
                        status: 'ok',
                        time: new Date().toISOString()
                    });
                }
            });

            // Handle disconnect
            socket.on('disconnect', (reason) => {
                let disconnectedUserId = null;
                
                // Find and remove disconnected user
                for (const [userId, socketId] of this.onlineUsers.entries()) {
                    if (socketId === socket.id) {
                        this.onlineUsers.delete(userId);
                        disconnectedUserId = userId;
                        break;
                    }
                }

                console.log(`❌ Client disconnected - Socket ID: ${socket.id}`);
                console.log(`⚠️ Disconnect reason: ${reason}`);
                if (disconnectedUserId) {
                    console.log(`👤 User ${disconnectedUserId} disconnected`);
                }
                console.log('📊 Remaining connections:', this.io.engine.clientsCount);
            });

            // Handle errors
            socket.on('error', (error) => {
                console.error('Socket error:', error);
            });
        });
    }

    // Emit event to specific user
    emitToUser(userId, event, data) {
        const socketId = this.onlineUsers.get(userId);
        if (socketId) {
            this.io.to(`user:${userId}`).emit(event, data);
        }
    }

    // Emit event to room
    // emitToRoom(roomId, event, data) {
    //     this.io.to(roomId).emit(event, data);
    // }

    // // Broadcast to all users except sender
    // broadcastToAll(event, data, excludeSocketId = null) {
    //     if (excludeSocketId) {
    //         this.io.except(excludeSocketId).emit(event, data);
    //     } else {
    //         this.io.emit(event, data);
    //     }
    // }

    // Get online status of user
    isUserOnline(userId) {
        return this.onlineUsers.has(userId);
    }
}

export default SocketService;