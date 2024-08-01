const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let rooms = {}; // Room id'lerine göre kullanıcı bilgilerini tutar

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log('Received message:', data);


        if (data.type === 'join' && data.userId) {
            const roomId = data.room;
            if (!rooms[roomId]) {
                rooms[roomId] = { players: {} };
            }
            rooms[roomId].players[data.userId] = { selectedCharacter: null, points: 0, name: data.userId };
            ws.roomId = roomId;
            ws.userId = data.userId;

            broadcast(roomId, {
                type: 'update',
                players: rooms[roomId].players
            });
        }

        if (data.type === 'selectCharacter' && data.userId) {
            const roomId = data.room;
            const userId = data.userId;
            if (rooms[roomId] && rooms[roomId].players[userId]) {
                rooms[roomId].players[userId].selectedCharacter = data.selectedCharacters;
                broadcast(roomId, {
                    type: 'update',
                    players: rooms[roomId].players
                });
            }
        }

        if (data.type === 'startGame' && data.userId) {
            const roomId = data.room;
            const userId = data.userId;
            const selectedCharacter = data.selectedCharacters;
            console.log("Secilen karakter",data);

            if (rooms[roomId] && rooms[roomId].players[userId]) {
                rooms[roomId].players[userId].selectedCharacter = selectedCharacter;
                broadcast(roomId, {
                    type: 'gameStarted',
                    players: rooms[roomId].players
                });
            }
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        const roomId = ws.roomId;
        const userId = ws.userId;
        if (rooms[roomId] && rooms[roomId].players[userId]) {
            delete rooms[roomId].players[userId];
            if (Object.keys(rooms[roomId].players).length === 0) {
                delete rooms[roomId]; // Odadaki son oyuncu ayrıldığında odayı sil
                console.log(`Room ${roomId} is now empty and has been deleted.`);
            } else {
                broadcast(roomId, {
                    type: 'update',
                    players: rooms[roomId].players
                });
            }
        }
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

function broadcast(roomId, message) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client.roomId === roomId) {
            client.send(JSON.stringify(message));
        }
    });
}

console.log('WebSocket server is running on ws://localhost:8080');
