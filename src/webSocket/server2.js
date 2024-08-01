const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let rooms = {};

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log('Received message:', data);
        
        const roomId = data.room;
        const userId = data.userId;

        if (data.type === 'join' && userId) {
            if (!rooms[roomId]) {
                rooms[roomId] = { players: {}, currentPlayer: null, playerOrder: [] };
            }
            rooms[roomId].players[userId] = { selectedCharacter: data.selectedCharacter, points: 0, name: userId };
            ws.roomId = roomId;
            ws.userId = userId;
            rooms[roomId].playerOrder.push(userId);
            console.log("Sıra", rooms[roomId].playerOrder);
            broadcast(roomId, {
                type: 'update',
                players: rooms[roomId].players
            });
        }

        if (data.type === 'selectCharacter' && userId) {
            if (rooms[roomId] && rooms[roomId].players[userId]) {
                rooms[roomId].players[userId].selectedCharacter = data.selectedCharacter;
                broadcast(roomId, {
                    type: 'update',
                    players: rooms[roomId].players
                });
            }
        }

        if (data.type === 'startGame' && userId) {
            if (rooms[roomId]) {
                if (!rooms[roomId].currentPlayer) {
                    rooms[roomId].currentPlayer = rooms[roomId].playerOrder[0];
                }
                broadcast(roomId, {
                    type: 'startGame',
                    players: rooms[roomId].players,
                    currentPlayer: rooms[roomId].currentPlayer
                });
            } else {
                console.error('Room not found');
            }
        }

        if (data.type === 'join-draw') {
            ws.roomId = roomId;
        }

        if (data.type === 'begin' || data.type === 'draw' || data.type === 'end' || data.type === 'clear') {
            broadcast(roomId,{
                type: data.type,
                x: data.x,
                y: data.y,
                room: roomId,
                currentPlayer: rooms[roomId].currentPlayer
            });

        }

        if (data.type === 'nextPlayer' && userId) {
            console.log("Current player", userId);
            if (rooms[roomId]) {
                const currentPlayerIndex = rooms[roomId].playerOrder.indexOf(rooms[roomId].currentPlayer);
                const nextPlayerIndex = (currentPlayerIndex + 2) % rooms[roomId].playerOrder.length;
                rooms[roomId].currentPlayer = rooms[roomId].playerOrder[nextPlayerIndex];
                console.log("Current player", rooms[roomId].currentPlayer);
                broadcast(roomId, {
                    type: 'update',
                    players: rooms[roomId].players,
                    currentPlayer: rooms[roomId].currentPlayer,
                });
            }
        }
    });

    ws.on('close', () => {
        if (ws.roomId && ws.userId) {
            const roomId = ws.roomId;
            const userId = ws.userId;

            if (rooms[roomId]) {
                delete rooms[roomId].players[userId];
                if (Object.keys(rooms[roomId].players).length === 0) {
                    delete rooms[roomId];
                } else {
                    rooms[roomId].playerOrder = rooms[roomId].playerOrder.filter(id => id !== userId);
                    broadcast(roomId, {
                        type: 'update',
                        players: rooms[roomId].players
                    });
                }
            }
        }
    });
});

function broadcast(roomId, message) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client.roomId === roomId) {
            console.log("BROADCAST MESSAGE", JSON.stringify(message));
            client.send(JSON.stringify(message));
        }
    });
}

console.log('WebSocket server is running on ws://localhost:8080');
