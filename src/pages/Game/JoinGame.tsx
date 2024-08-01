import { useState } from "react";
import { useNavigate } from "react-router-dom";

function JoinGame () {

    const navigate = useNavigate();
    const [gameId, setGameId] = useState<string>("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGameId(e.target.value);
    };

    const handleButtonClick = () => {   
        setGameId(gameId);
        navigate(`/waiting-room/${gameId}`);
    }

    return(
        <div>
            <input 
                type="text" 
                value={gameId}
                onChange={handleInputChange}
                placeholder="Enter Room ID"
            />
            <button onClick={handleButtonClick}>Join Game!</button>
        </div>
    );
}

export default JoinGame;