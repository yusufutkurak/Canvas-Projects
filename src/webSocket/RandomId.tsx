import { useState, useEffect } from "react";

function RandomId() {
    const getStoredId = () => {
        const storedId = localStorage.getItem('userId');
        if (storedId) {
            return parseInt(storedId, 10);
        } else {
            const newId = Math.floor(Math.random() * 1e50);
            localStorage.setItem('userId', newId.toString());
            return newId;
        }
    };

    const id = getStoredId();
    const [isPlay, setIsPlay] = useState(false);
    const [activeRoom, setActiveRoom] = useState<string | undefined>(undefined);
    
    const updateUser = (isActive: boolean) => {
        setIsPlay(isActive);
        localStorage.setItem('isActive', JSON.stringify(isPlay));
    }

    const activateRoom = (roomId: string | undefined) => {
        setActiveRoom(roomId);
        if(roomId){
            localStorage.setItem('activeRoom', roomId.toString());
        }
    }

    const deActivateRoom = () => {
        setActiveRoom(undefined);
    }

    return {
        isPlay,
        updateUser,
        activateRoom,
        deActivateRoom
    };
}

export default RandomId;


