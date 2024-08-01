import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./style/waitingRoom.css";

interface CharacterInfo {
    id: number;
    img: string;
    name: string;
}

class Character implements CharacterInfo {
    id: number;
    img: string;
    name: string;

    constructor(id: number, img: string, name: string) {
        this.id = id;
        this.img = img;
        this.name = name;
    }
}

interface WaitingRoomProps {
    ws: WebSocket | null;
    userId: string | null;
}

function WaitingRoom({ ws, userId }: WaitingRoomProps) {
    const { gameId } = useParams<{ gameId: string }>();
    const navigate = useNavigate();
    const [characters, setCharacters] = useState<Character[]>([]);
    const [players, setPlayers] = useState<{ [key: string]: CharacterInfo }>({});
    const [mySelection, setMySelection] = useState<number | null>(null);

    useEffect(() => {
        const bob = new Character(1, '1', 'Bob');
        const franky = new Character(2, '2', 'Franky'); 
        const tommy = new Character(3, '3', 'Tommy');
        const caesar = new Character(4, '4', 'Caesar');
        setCharacters([bob, franky, tommy, caesar]);

        if (ws && userId) {
            ws.send(JSON.stringify({
                type: 'join',
                room: gameId,
                userId: userId
            }));

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log("Received WebSocket message in WaitingRoom:", data);
                if (data.type === 'update') {
                    setPlayers(data.players);
                }
            };
        }

        return () => {
            if (ws) {
                ws.onmessage = null;
            }
        };
    }, [gameId, ws, userId]);

    const handleButtonClick = (id: number) => {
        if (!ws || !userId) return;

        if (mySelection === id) {
            setMySelection(null);
            ws.send(JSON.stringify({
                type: 'selectCharacter',
                room: gameId,
                userId: userId,
                selectedCharacter: null
            }));
        } else {
            setMySelection(id);
            ws.send(JSON.stringify({
                type: 'selectCharacter',
                room: gameId,
                userId: userId,
                selectedCharacter: id
            }));
        }
    };

    const handleStartClick = () => {
        if (mySelection !== null && ws) {
            ws.send(JSON.stringify({
                type: 'startGame',
                room: gameId,
                userId: userId
            }));
            navigate(`/room/${gameId}`);
        }
    };

    console.log("WaitingRoom rendered", { characters, players, mySelection });

    return (
        <div className="characterBox">
            {characters.map(character => (
                <div key={character.id} className="characterCard">
                    <img src={`/img/${character.img}.png`} alt={character.name} />
                    <p>{character.name}</p>
                    <button
                        className={mySelection === character.id ? 'selected' : ''}
                        onClick={() => handleButtonClick(character.id)}
                    >
                        {mySelection === character.id ? 'Unselect' : 'Choose'}
                    </button>
                </div>
            ))}
            <button onClick={handleStartClick}>Start</button>
        </div>
    );
}

export default WaitingRoom;
