import React, {useState} from "react";
import {Canvas} from "../Canvas/Canvas.tsx";

import "./map.css";
import {Fetch} from "../../utils/Fetch.tsx";
import {Edge, Vertex} from "../../interfaces/interfaces.ts";

export const Map = () => {

    //States
    const [isDragging, setIsDragging] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [mapPos, setMapPos] = useState({x: 0,y: 0});
    const [scale, setScale] = useState(1);

    const [vertices, setVertices] = useState<Vertex[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

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

        const res2 = await Fetch('/api/edges',"GET") as string;
        setEdges(JSON.parse(res2));
    }
    const clearHandler = async () => {
        await Fetch('/api/clear',"POST");
        setVertices([]);
        setEdges([]);
    }


    const draw = (context: CanvasRenderingContext2D) => {

        if(!vertices) return;
        context.save();
        context.clearRect(0, 0, context.canvas.width, context.canvas.height)
        context.fillStyle = 'grey'
        context.scale(scale,scale);

        const gridSize = 20;
        context.beginPath();
        context.strokeStyle = '#ccc'; // jasnoszara kratka
        for (let x = 0; x < context.canvas.width / scale; x += gridSize) {
            context.moveTo(x + mapPos.x % gridSize, 0);
            context.lineTo(x + mapPos.x % gridSize, context.canvas.height / scale);
        }
        for (let y = 0; y < context.canvas.height / scale; y += gridSize) {
            context.moveTo(0, y + mapPos.y % gridSize);
            context.lineTo(context.canvas.width / scale, y + mapPos.y % gridSize);
        }
        context.lineWidth = 1;
        context.stroke();

        context.beginPath();
        context.fillStyle = 'blue';
        context.arc(mapPos.x, mapPos.y, 2, 0, Math.PI * 2);
        context.fill();
        context.font = `${12*(1/scale)}px Arial`;
        context.fillText(`(0, 0)`, mapPos.x,mapPos.y-4);

        edges.map(e => {
            context.beginPath();
            const vFrom = vertices.filter(v => v.id == e.fromId)[0];
            const vTo = vertices.filter(v => v.id == e.toId)[0];
            context.moveTo(vFrom.position.x+mapPos.x, vFrom.position.y+mapPos.y);
            context.lineTo(vTo.position.x+mapPos.x, vTo.position.y+mapPos.y);
            context.lineWidth = 4;
            context.stroke();
        });

        vertices.map(v => {
            context.fillStyle = v.type === 'field' ? 'green' : v.type === 'brewery' ? 'orange' : v.type === 'inn' ? 'red' : 'gray'
            context.fillRect(v.position.x+mapPos.x-10, v.position.y+mapPos.y-10, 20, 20);
            context.fillStyle = 'black';
            context.font = `${12*(1/scale)}px Arial`;;
            context.textAlign = 'center';
            context.textBaseline = 'middle';

            context.fillText(`${v.type} id: ${v.id}`, v.position.x+mapPos.x, v.position.y+mapPos.y);
        });

        context.restore();
    }

    return(
        <>
            <h4 className="mouse-cordinats">x: {(((mousePosition.x-mapPos.x)-mapPos.x*(scale-1))/scale).toFixed(0)} y: {(((mousePosition.y-mapPos.y)-mapPos.y*(scale-1))/scale).toFixed(0)}</h4>
            <div>
                <span> {scale} </span>
                <button onClick={() => setScale(prevState => prevState >= 1 ? prevState + 1 : prevState*2)}>+</button>
                <button onClick={() => setScale(prevState => prevState > 1 ? prevState - 1 : prevState/2)}>-</button>
                <button className='refresh-btn' onClick={() => refreshHandler()}>Odźwierz</button>
                <button className='refresh-btn' onClick={() => clearHandler()}>Wyszyść dane</button>
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