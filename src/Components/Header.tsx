import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
    const [isActive, setIsActive] = useState(false);
    const [roomId, setRoomId] = useState<string | null>();

    useEffect(() => {
        const storedIsActive = localStorage.getItem('isActive');
        if (storedIsActive) {
            setIsActive(JSON.parse(storedIsActive));
        }

        const roomId = localStorage.getItem('activeRoom');
        setRoomId(roomId);
    }, []);

    return (
        <div className="navbar">
            <nav className="navbar-container">
                <Link to="/" className="nav-link-home">Home</Link>
                {isActive ?
                (
                <Link to={`room/${roomId}`} className="nav-link">Continue Game</Link>):
                (<>
                    <Link to="/join" className="nav-link">Join Game</Link>
                    <Link to="/create-game" className="nav-link">Create Game</Link>
                </>)}
            </nav>
        </div>
    );
}


export default Header;
