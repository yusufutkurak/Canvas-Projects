import React from "react";
import { useNavigate } from "react-router-dom";

interface GameInfo {
    GameId: number;
}

class GameRoom implements GameInfo {
    GameId: number;
    
    public constructor() {
        this.GameId = Math.floor(Math.random() * 39823749);
    }
}

function CreateGame() {
    const navigate = useNavigate();
    
    const handleButtonClick = () => {
        const room = new GameRoom();
        navigate(`/waiting-room/${room.GameId}`);
    }

    return (
        <div className="createGame">
            <button onClick={handleButtonClick}>Create Game</button>
        </div>
    );
}

export default CreateGame;
