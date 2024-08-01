import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./style/gamePlay.css";
import WhiteBoard from "../../Canvas/WhiteBoard";

interface CharacterInfo {
    id: number;
    img: string;
    name: string;
    points: number;
    selectedCharacter: string;
}

interface PlayerInfo {
    [key: string]: CharacterInfo;
}

interface GamePlayProps {
    ws: WebSocket | null;
    userId: string | null;
}

function GamePlay({ ws, userId }: GamePlayProps) {
    const { gameId } = useParams<{ gameId: string }>();
    const [players, setPlayers] = useState<PlayerInfo>({});
    const [currentPlayer, setCurrentPlayer] = useState<string | null>(null);
    const [data, setData] = useState<string | null>(null); 

    useEffect(() => {
        if (ws && userId) {
            ws.onopen = () => {
                ws.send(JSON.stringify({
                    type: 'startGame',
                    room: gameId,
                    userId: userId
                }));
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log("Received WebSocket message in GamePlay:", data);
                setData(event.data); 
                if (data.type === 'update' || data.type === 'startGame') {
                    setPlayers(data.players);
                    if (data.currentPlayer) {
                        setCurrentPlayer(data.currentPlayer);
                    }
                }
            };

            ws.onerror = (error) => {
                console.error("WebSocket error:", error);
            };
        }

        return () => {
            if (ws) {
                ws.onmessage = null;
            }
        };
    }, [gameId, ws, userId]);

    if (!gameId) {
        return <div>Error: No game ID provided</div>;
    }


    console.log("GamePlay rendered", { players, currentPlayer });

    return (
        <div>
            <h1>Game Room: {gameId}</h1>
            <div className="playersList">
                {Object.keys(players).map((playerId) => (
                    <div key={playerId} className="characterCard">
                        <img src={`/img/${players[playerId].selectedCharacter}.png`} alt={players[playerId].name} />
                        <h2>{players[playerId].selectedCharacter}</h2>
                    </div>
                ))}
            </div>
            <WhiteBoard ws={ws} gameId={gameId} data={data} userId={userId}/> 
        </div>
    );
}  

export default GamePlay;
