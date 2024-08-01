import React, { useEffect, useRef, useState, MouseEvent } from 'react';
import Button from '@mui/joy/Button';
import ButtonGroup from '@mui/joy/ButtonGroup';

interface DrawingData {
    type: 'begin' | 'draw' | 'end' | 'clear';
    room: string;
    x?: number;
    y?: number;
    currentPlayer: string | null;
}

interface WhiteBoardProps {
    ws: WebSocket | null;
    gameId: string;
    data: string | null; 
    userId: string | null;
}

type GameOption = 'pixel' | 'rainbowCircle' | 'circle' | 'wave';

const WhiteBoard: React.FC<WhiteBoardProps> = ({ ws, gameId, data, userId }) => {
    const contextReference = useRef<CanvasRenderingContext2D | null>(null);
    const [gameMode, setGameMode] = useState<GameOption>('pixel');
    const canvasReference = useRef<HTMLCanvasElement | null>(null);
    const [isPressed, setIsPressed] = useState(false);
    const isClearing = useRef(false); 
    const room = gameId;

    const beginDraw = (e: MouseEvent<HTMLCanvasElement>) => {
        if (contextReference.current && parsedData?.currentPlayer === userId) {
            contextReference.current.strokeStyle = 'black';
            contextReference.current.beginPath();
            contextReference.current.moveTo(
                e.nativeEvent.offsetX,
                e.nativeEvent.offsetY
            );
            setIsPressed(true);
            sendDrawingData(
                'begin',
                e.nativeEvent.offsetX,
                e.nativeEvent.offsetY
            );
        }
    };

    const endDraw = () => {
        if (contextReference.current && parsedData?.currentPlayer === userId) {
            contextReference.current.closePath();
            setIsPressed(false);
            sendDrawingData('end');
        }
    };

    const updateDraw = (e: MouseEvent<HTMLCanvasElement>) => {
        if(parsedData?.currentPlayer === userId){
            if (!isPressed || !contextReference.current) return;
            contextReference.current.strokeStyle = 'black';
            contextReference.current.lineTo(
                e.nativeEvent.offsetX,
                e.nativeEvent.offsetY
            );
            contextReference.current.stroke();
            sendDrawingData(
                'draw',
                e.nativeEvent.offsetX,
                e.nativeEvent.offsetY
            );
        }
    };

    const sendDrawingData = (type: 'begin' | 'draw' | 'end' | 'clear', x?: number, y?: number) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            const message: DrawingData = { type, room: gameId, x, y, currentPlayer: userId };
            console.log("Drawing data", message);
            ws.send(JSON.stringify(message));
        } else {
            console.error('WebSocket connection is not open');
        }
    };

    const clearBoard = () => {
        if (contextReference.current) {
            isClearing.current = true;
            contextReference.current.fillStyle = "white";
            contextReference.current.fillRect(0, 0, canvasReference.current!.width, canvasReference.current!.height);
            sendDrawingData('clear');
            contextReference.current.fillStyle = "black";
        }
    };

    const handleNextPlayer = () => {
        console.log("Next player", userId, parsedData?.currentPlayer);
        if (ws && userId) {
            ws.send(JSON.stringify({
                type: 'nextPlayer',
                room: gameId,
                userId: userId
            }));
            console.log("Next player", userId, parsedData?.currentPlayer);
        }
    };
    const handleModeClick = (mode: GameOption) => {
        setGameMode(mode);
    }

    const handleIncomingDrawing = (message: string) => {
        const data: DrawingData = JSON.parse(message);
        console.log("mode", gameMode);
        if (contextReference.current && data.room === room && data.currentPlayer !== userId) {
            if (gameMode === 'pixel') {
                pixelDrawing(data);
            }
            if (gameMode === 'circle') {
                circleDrawing(data);
            }
            if (gameMode === 'rainbowCircle') {
                rainbowCircleDrawing(data);
            }
            if (gameMode === 'wave') {
                waveDrawing(data);
            }
            if (data.type === 'clear') {
                if (!isClearing.current) {
                    clearBoard();
                }
                isClearing.current = false;
            }
        }
    };

    const pixelDrawing = (data: DrawingData) => {
        const pixelSize = 15; 
        console.log("Pixel girildi");        

        if (contextReference.current && data.room === room) {
            contextReference.current.strokeStyle = 'black';
            if (data.type === 'begin' && data.x !== undefined && data.y !== undefined) {
                contextReference.current.beginPath();
                contextReference.current.lineWidth = 10;
                const startX = Math.round(data.x / pixelSize) * pixelSize;
                const startY = Math.round(data.y / pixelSize) * pixelSize;
                contextReference.current.moveTo(startX, startY);
            } else if (data.type === 'draw' && data.x !== undefined && data.y !== undefined) {
                const x = Math.round(data.x / pixelSize) * pixelSize;
                const y = Math.round(data.y / pixelSize) * pixelSize;
                contextReference.current.lineTo(x, y);
                contextReference.current.stroke();    
                console.log("Mouse x-y:", data.x, data.y);
                console.log("Pixelize x-y:", x, y);
            } else if (data.type === 'end') {
                contextReference.current.closePath();
            } else if (data.type === 'clear') {
                clearBoard();
            }
        }
    };

    const circleDrawing = (data: DrawingData) => {
    console.log("Circle girildi");        
        if (contextReference.current && data.room === room) {
            contextReference.current.strokeStyle = 'black';

            if (data.type === 'begin' && data.x !== undefined && data.y !== undefined) {
                contextReference.current.beginPath();
                contextReference.current.lineWidth = 2;
                contextReference.current.arc(data.x, data.y, 5, 0, 2 * Math.PI);

            } else if (data.type === 'draw' && data.x !== undefined && data.y !== undefined) {
                contextReference.current.beginPath();
                contextReference.current.arc(data.x, data.y, 10, 0, 2 * Math.PI);
                contextReference.current.stroke();
            } else if (data.type === 'end') {
                contextReference.current.closePath();
            } else if (data.type === 'clear') {
                clearBoard();
            }
        }
    };

    const rainbowCircleDrawing = (data: DrawingData) => {
    
        if (contextReference.current && data.room === room) {
            if (data.type === 'begin' && data.x !== undefined && data.y !== undefined) {
                contextReference.current.lineWidth = 2;
                for (let i = 0; i < 6; i++) {
                    for (let j = 0; j < 6; j++) {
                        const randomColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
                        contextReference.current.strokeStyle = randomColor;
                        contextReference.current.beginPath();
                        contextReference.current.arc(data.x, data.y, 10, 0, 2 * Math.PI);
                        contextReference.current.stroke();
                    }
                }
            } else if (data.type === 'draw' && data.x !== undefined && data.y !== undefined) {
                for (let i = 0; i < 6; i++) {
                    for (let j = 0; j < 6; j++) {
                        const randomColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
                        contextReference.current.strokeStyle = randomColor;
                        contextReference.current.beginPath();
                        contextReference.current.arc(data.x, data.y, 10, 0, 2 * Math.PI);
                        contextReference.current.stroke();
                    }
                }
            } else if (data.type === 'end') {
                contextReference.current.closePath();
            } else if (data.type === 'clear') {
                clearBoard();
            }
        }
    };
    
    const waveDrawing = (data: DrawingData) => {
        if (contextReference.current && data.room === room) {
            contextReference.current.strokeStyle = 'black';
            if (data.type === 'begin' && data.x !== undefined && data.y !== undefined) {
                contextReference.current.beginPath();
                contextReference.current.moveTo(data.x +90 , data.y +90);
            } else if (data.type === 'draw' && data.x !== undefined && data.y !== undefined) {
                contextReference.current.quadraticCurveTo(data.x,data.y, data.x+90, data.y+90);
                contextReference.current.stroke();
            } else if (data.type === 'end') {
                contextReference.current.closePath();
            } else if (data.type === 'clear') {
                clearBoard();
            }
        }
    };

    
    useEffect(() => {
        const canvas = canvasReference.current;

        if (canvas) {
            canvas.width = 500;
            canvas.height = 500;

            const context = canvas.getContext('2d');

            if (context) {
                context.lineCap = 'round';
                context.strokeStyle = 'black';
                context.lineWidth = 5;
                contextReference.current = context;
            }
        }
    }, [ws, gameId]);

    useEffect(() => {
        if (data) {
            handleIncomingDrawing(data);
        }
    }, [data]);

    const parsedData: DrawingData | null = data ? JSON.parse(data) : null;

    return (
        <div>
            <ButtonGroup>
                <Button onClick={() => handleModeClick('pixel')}>Pixel</Button>
                <Button onClick={() => handleModeClick('circle')}>Circle</Button>
                <Button onClick={() => handleModeClick('rainbowCircle')}>Rainbow Circle</Button>
                <Button onClick={() => handleModeClick('wave')}>Wave</Button>
            </ButtonGroup>
            <div className="canvasBox">
                <canvas
                    ref={canvasReference}
                    onMouseDown={beginDraw}
                    onMouseMove={updateDraw}
                    onMouseUp={endDraw}
                    onMouseLeave={endDraw}
                    width="500"
                    height="500"
                />
            </div>

            <div>
            {parsedData && parsedData.currentPlayer === userId && (
                <ButtonGroup>
                    <Button onClick={clearBoard}>Clear</Button>
                    <Button onClick={handleNextPlayer}>Next Player</Button>
                </ButtonGroup>
            )}
            </div>
        </div>
    );
};

export default WhiteBoard;
