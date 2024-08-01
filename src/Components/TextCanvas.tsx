import React, { useRef, useEffect, useState } from "react";

const TextCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [position, setPosition] = useState({ x: 0, y: window.innerHeight / 2 });
  const [counter, setCounter] = useState(0);
  const minFontSize = 30;
  const angleDistortion = 0;
  const letters = "Kimseyi görmedim ben Senden daha güzel Kimseyi tanımadım ben Senden daha özel Kimselere de bakmadım Aklımdan geçen Kimseyi tanımadım ben Senden daha güzel Senden daha güzel Senden daha güzel Senden daha güzel Sana nerden rastladım? Oldum derbeder Kendimi sana sakladım Senden daha güzel'";
  const [mouse, setMouse] = useState({ x: 0, y: 0, down: false });
  const hueRef = useRef(0);

  const distance = (pt: { x: number; y: number }, pt2: { x: number; y: number }) => {
    const xs = (pt2.x - pt.x) * (pt2.x - pt.x);
    const ys = (pt2.y - pt.y) * (pt2.y - pt.y);
    return Math.sqrt(xs + ys);
  };

  const textWidth = (context: CanvasRenderingContext2D, string: string, size: number) => {
    context.font = size + "px Georgia";
    return context.measureText(string).width;
  };

  const draw = (context: CanvasRenderingContext2D) => {
    if (mouse.down) {
      const d = distance(position, mouse);
      const fontSize = minFontSize + d / 2;
      const letter = letters[counter];
      const stepSize = textWidth(context, letter, fontSize);

      if (d > stepSize) {
        const angle = Math.atan2(mouse.y - position.y, mouse.x - position.x);

        context.font = fontSize + "px Georgia";

        context.save();
        context.translate(position.x, position.y);
        context.rotate(angle);

        const textMetrics = context.measureText(letter);
        const textHeight = fontSize;

        context.strokeStyle = `hsl(${hueRef.current}, 100%, 50%)`;
        context.lineWidth = 0.2;
        let temp = 0;
        for (let i = 0; i < textMetrics.width; i += 2) {
          context.beginPath();

          if(i <= textMetrics.width ){
            context.moveTo(i, -textHeight);
            temp = i;
          }

       
          
          context.lineTo(i, 0);
          context.stroke();
          context.closePath();
        }
        context.fillText(letter, 0, 0);
        context.restore();

        setCounter((prevCounter) => (prevCounter + 1) % letters.length);

        setPosition({
          x: position.x + Math.cos(angle) * stepSize,
          y: position.y + Math.sin(angle) * stepSize,
        });

      }
    }
  };


  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    hueRef.current += 20;

    setMouse({ ...mouse, x: event.pageX, y: event.pageY });
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) draw(context);
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setMouse({ ...mouse, down: true });
    setPosition({ x: event.pageX, y: event.pageY });
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) draw(context);
    }
  };

  const handleMouseUp = () => {
    setMouse({ ...mouse, down: false });
  };

  const handleDoubleClick = () => {
    const canvas = canvasRef.current;
    if (canvas) canvas.width = canvas.width;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      window.onresize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
    }
  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        id="canvas"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseUp}
        onDoubleClick={handleDoubleClick}
      ></canvas>
    </div>
  );
};

export default TextCanvas;
