import React, {useState} from "react";
import {Canvas} from "../Canvas/Canvas.tsx";

import "./map.css";
import {Fetch} from "../../utils/Fetch.tsx";
import {Vertex} from "../../interfaces/interfaces.ts";

export const Map = () => {

    //States
    const [isDragging, setIsDragging] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [mapPos, setMapPos] = useState({x: 0,y: 0});
    const [scale, setScale] = useState(1);

    const [vertices, setVertices] = useState<Vertex[]>([]);

    //Handlers
    const scrollHandler = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvasRect = (e.target as HTMLCanvasElement).getBoundingClientRect();
        const currentMousePos = {
            x: e.clientX - canvasRect.left,
            y: e.clientY - canvasRect.top
        };

        const deltaX = (currentMousePos.x - mousePosition.x) / scale;
        const deltaY = (currentMousePos.y - mousePosition.y) / scale;

        setMapPos(prevState => ({
            x: prevState.x + deltaX,
            y: prevState.y + deltaY
        }));
    }
    const mouseHandler = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvasRect = (e.target as HTMLCanvasElement).getBoundingClientRect();
        setMousePosition({
            x: e.clientX - canvasRect.left,
            y: e.clientY - canvasRect.top
        });
    }
    const mapHandler = (e: React.MouseEvent<HTMLCanvasElement>) => {
        mouseHandler(e)
        if(isDragging) scrollHandler(e)
    }

    const refreshHandler = async () => {
        const res = await Fetch('/api/vertices',"GET") as string;
        setVertices(JSON.parse(res));
    }


    const draw = (context: CanvasRenderingContext2D) => {
        if(!vertices) return;
        context.save();
        context.clearRect(0, 0, context.canvas.width, context.canvas.height)
        context.fillStyle = 'grey'
        context.scale(scale,scale);

        context.beginPath();
        context.fillStyle = 'blue';
        context.arc(mapPos.x, mapPos.y, 2, 0, Math.PI * 2);
        context.fill();
        context.font = '4px Arial';
        context.fillText(`(0, 0)`, mapPos.x,mapPos.y-4);

        vertices.map(v => {
            context.fillStyle = 'grey'
            context.fillRect(v.position.x+mapPos.x, v.position.y+mapPos.y, 20, 20);
            context.fillStyle = 'black';
            context.font = '4px Arial';
            context.textAlign = 'center';
            context.textBaseline = 'middle';

            context.fillText(`${v.type} id: ${v.id}`, v.position.x+mapPos.x+10, v.position.y+mapPos.y+10);
        });

        context.restore();
    }

    return(
        <>
            <h4 className="mouse-cordinats">x: {((mousePosition.x-mapPos.x)-mapPos.x*(scale-1)).toFixed(0)} y: {((mousePosition.y-mapPos.y)-mapPos.y*(scale-1)).toFixed(0)}</h4>
            <div>
                <span> {scale} </span>
                <button onClick={() => setScale(prevState => prevState >= 1 ? prevState + 1 : prevState*2)}>+</button>
                <button onClick={() => setScale(prevState => prevState > 1 ? prevState - 1 : prevState/2)}>-</button>
                <button className='refresh-btn' onClick={() => refreshHandler()}>Odźwierz</button>
            </div>
            <Canvas
                draw={draw}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onMouseMove={(e: React.MouseEvent<HTMLCanvasElement>) => mapHandler(e)}
            />
        </>
    )
}