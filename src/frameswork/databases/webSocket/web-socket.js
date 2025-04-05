import { WebSocketServer } from 'ws';

class WebSocketService {
    constructor(server) {
        if (!server) {
            throw new Error('HTTP server instance is required');
        }

        this.wss = new WebSocketServer({ 
            server,
            path: '/ws',
            clientTracking: true
        });

        console.log('WebSocket Server initialized');
        this.setupWebSocket();
    }

    setupWebSocket() {
        this.wss.on('connection', (ws, req) => {
            console.log('New client connected');
            
            // Send welcome message
            ws.send(JSON.stringify({
                type: 'connection',
                message: 'Connected to WebSocket server'
            }));

            // Handle incoming messages
            ws.on('message', (data) => {
                try {
                    const message = JSON.parse(data);
                    console.log('Received message:', message);
                    // Handle the message
                    this.handleMessage(ws, message);
                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            });

            // Handle client disconnection
            ws.on('close', () => {
                console.log('Client disconnected');
            });

            // Handle errors
            ws.on('error', (error) => {
                console.error('WebSocket error:', error);
            });
        });

        // Handle server errors
        this.wss.on('error', (error) => {
            console.error('WebSocket server error:', error);
        });
    }

    handleMessage(ws, message) {
        try {
            switch (message.type) {
                case 'ping':
                    ws.send(JSON.stringify({
                        type: 'pong',
                        timestamp: Date.now()
                    }));
                    break;
                    
                default:
                    ws.send(JSON.stringify({
                        type: 'message',
                        data: message
                    }));
            }
        } catch (error) {
            console.error('Error handling message:', error);
        }
    }

    // Broadcast message to all connected clients
    broadcast(message) {
        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    }

    // Send message to specific client
    sendTo(ws, message) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
        }
    }
}

export default WebSocketService;