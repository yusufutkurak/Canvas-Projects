import './App.css'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Header from './Components/Header';
import CreateGame from './pages/Game/CreateGame';
import GamePlay from './pages/Game/GamePlay';
import JoinGame from './pages/Game/JoinGame';
import WaitingRoom from './pages/Game/WaitingRoom';
import { useEffect, useState } from 'react';

function App() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');
    
    socket.onopen = () => {
      console.log("Socket is open");
      setWs(socket);
    };

    socket.onerror = (error) => {
      console.error("Socket error:", error);
    };

    socket.onclose = (event) => {
      console.log("Websocket connection closed", event);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
      console.log("Cleaning up websocket");
    };
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newUserId = `user-${Date.now()}`;
      localStorage.setItem("userId", newUserId);
      setUserId(newUserId);
    }
  }, []);

  console.log("App component rendered", { ws, userId });

  return (
    <div>
      <BrowserRouter>
        <Header />
        <main>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/create-game' element={<CreateGame />} />
            <Route path='/room/:gameId' element={<GamePlay ws={ws} userId={userId} />} />
            <Route path='/join' element={<JoinGame />} />
            <Route path='/waiting-room/:gameId' element={<WaitingRoom ws={ws} userId={userId} />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
