import {Dispatch, SetStateAction, useRef, useState} from "react";
import {Canvas} from "../Canvas/Canvas.tsx";
import {Cross, Edge, Field, Path, Pathing, Quadrant, Vertex} from "../../interfaces/interfaces.ts";
import {Stage, Layer, Rect, Circle, Line, Text, Arrow} from "react-konva";
import {KonvaEventObject} from "konva/lib/Node";
import {Pin} from "../Pin/Pin.tsx";

import "./map.css";
import {ToFixed} from "../../utils/ToFixed.tsx";
import {List} from "../List/List.tsx";

type Props = {
    vertices:Vertex[];
    edges: Edge[];
    pathing: Path[];
    quadrants: Quadrant[];
    showPaths: Pathing;
    setVertices: Dispatch<SetStateAction<Vertex[]>>;
    setEdges: Dispatch<SetStateAction<Edge[]>>;
}

export const Map = ({vertices,edges,quadrants,pathing,showPaths,setVertices,setEdges}:Props) => {

    //States
    const [isDragging, setIsDragging] = useState(false);
    const [mapPos, setMapPos] = useState({x: 0,y: 0});
    const [pointerPos, setPointerPos] = useState({x: 0,y: 0})
    const [scale, setScale] = useState(1);

    const [pin, setPin] = useState<Vertex|Field|Cross|Edge|null>(null);

    const lastMousePos = useRef<{ x: number, y: number } | null>(null);

    //Handlers
    const scrollHandler = (e: KonvaEventObject<MouseEvent>) => {
        const stage = e.target.getStage();
        const pointer = stage?.getPointerPosition();
        if (!pointer || !lastMousePos.current) return;

        const deltaX = pointer.x - lastMousePos.current.x;
        const deltaY = pointer.y - lastMousePos.current.y;

        setMapPos(prev => ({
            x: prev.x + deltaX,
            y: prev.y + deltaY,
        }));

        lastMousePos.current = pointer;
    }

    const mapHandler = (e: KonvaEventObject<MouseEvent>) => {
        if (isDragging) scrollHandler(e);

        const pointer = e.target.getStage()?.getPointerPosition();
        if (pointer) {
            lastMousePos.current = pointer;
            setPointerPos(lastMousePos.current);
        }
    }

    const showDetails = (e: Vertex|Field|Cross|Edge) => {
        if("fromId" in e){
            setPin({id: e.id, fromId: e.fromId, toId: e.toId, cost: e.cost});
        }
        else if ("limit" in e) {
            setPin({id: e.id, position: e.position, type: e.type, limit: e.limit});
        }
        else if ("production" in e) {
            setPin({id: e.id, position: e.position, type: e.type, production: e.production});
        }
        else
            setPin({id: e.id, position: e.position, type: e.type});
    }
    const hideDetails = () => {
        setPin(null);
    }

    //Draw
    const drawGrid = (context: CanvasRenderingContext2D) => {

        if(!vertices) return;
        context.save();
        context.clearRect(0, 0, context.canvas.width, context.canvas.height)
        context.fillStyle = 'grey'
        context.scale(scale,scale);

        const gridSize = 20;
        context.beginPath();
        context.strokeStyle = '#ccc';

        for (let x = 0; x < context.canvas.width / scale; x += gridSize) {
            context.moveTo(x + mapPos.x/scale % gridSize, 0);
            context.lineTo(x + mapPos.x/scale % gridSize, context.canvas.height / scale);
        }
        for (let y = 0; y < context.canvas.height / scale; y += gridSize) {
            context.moveTo(0, y + mapPos.y/scale % gridSize);
            context.lineTo(context.canvas.width / scale, y + mapPos.y/scale % gridSize);
        }
        context.lineWidth = 1;
        context.stroke();

        context.restore();
    }

    const drawV = vertices.map(v => (
        <Rect
            key={"v" + v.id}
            width={20}
            height={20}
            x={v.position.x - 10}
            y={v.position.y - 10}
            fill={v.type.toUpperCase() === 'FIELD' ? 'green' : v.type.toUpperCase() === 'BREWERY' ? 'orange' : v.type.toUpperCase() === 'INN' ? 'red' : 'gray'}
            onMouseEnter={() => showDetails(v)}
            onMouseLeave={() => hideDetails()}
        />
    ))

    const drawE = edges.map(e => {
        const vFrom = vertices.filter(v => v.id == e.fromId)[0];
        const vTo = vertices.filter(v => v.id == e.toId)[0];

        return <Line
            key={"e"+e.id}
            stroke={'#aaa'}
            strokeWidth={15}
            points={[vFrom.position.x,vFrom.position.y,vTo.position.x,vTo.position.y]}
            onMouseEnter={() => showDetails(e)}
            onMouseLeave={() => hideDetails()}
        />
    })

    const drawQ = quadrants.map((q, index) => {
        const pointsArray = q.points.flatMap(p => [p.x, p.y]);
        return (
            <Line
                key={"q" + index}
                points={pointsArray}
                closed={true}
                fill="rgba(150, 255, 100, 0.3)"
                stroke="rgba(20, 150, 20, 1)"
                strokeWidth={2}
            />
        );
    });

    const drawPathing = pathing.filter(e => showPaths?.type === e.transports).map((e,i) => {
        const vFrom = vertices.filter(v => v.id == e.fromId)[0];
        const vTo = vertices.filter(v => v.id == e.toId)[0];

        let edge:Edge|null = null;
        edge = edges.filter(i => i.fromId === e.fromId && i.toId === e.toId)[0];

        let showCost = "";
        if(showPaths?.costs === true) {
            showCost = "/" + ToFixed(edge ? edge?.cost : 0);
        }

        return (
            <>
                <Text
                    key={"text"+i*100}
                    x={(vFrom.position.x+vTo.position.x)/2 - 20}
                    y={(vFrom.position.y+vTo.position.y)/2}
                    fill={'black'}
                    text={ToFixed(e.amount).toString() + showCost}
                    fontSize={12/scale*scale}
                    fontFamily={'Calibri'}
                />
                <Arrow
                    key={"path"+i*100}
                    stroke={'red'}
                    points={[vFrom.position.x,vFrom.position.y,vTo.position.x,vTo.position.y]}
                    pointerLength={20}
                    pointerWidth={20}
                    onMouseEnter={() => showDetails(edge)}
                    onMouseLeave={() => hideDetails()}
                />
            </>
        )
    })

    return(
        <>
            <h4 className="mouse-cordinats">
                x: {((pointerPos.x - mapPos.x)/scale).toFixed(0)} y: {((pointerPos.y - mapPos.y)/scale).toFixed(0)}
            </h4>
            <div>
                <span> {scale} </span>
                <button disabled={scale >= 10}  onClick={() => setScale(prev => prev >= 1 ? prev + 1 : prev * 2)}>+</button>
                <button disabled={scale <= 0.125} onClick={() => setScale(prev => prev > 1 ? prev - 1 : prev / 2)}>-</button>
            </div>

            <div style={{ position: 'relative', width: 800, height: 800, margin: "auto", backgroundColor: 'white' }}>
                <Canvas draw={drawGrid} />
                <Stage
                    key={"s"+1}
                    width={800}
                    height={800}
                    onMouseDown={() => setIsDragging(true)}
                    onMouseUp={() => setIsDragging(false)}
                    onMouseMove={mapHandler}
                    style={{ position: 'absolute', top: 0, left: 0 }}
                >
                    <Layer scale={{ x: scale, y: scale }} offset={{ x: -mapPos.x/scale, y: -mapPos.y/scale }}>
                    <Circle radius={6} x={0} y={0} fill='red' />
                        {drawQ}
                        {drawE}
                        {drawV}
                        {drawPathing}
                    </Layer>
                </Stage>
                {pin ? <Pin
                    id={pin.id}
                    type={"type" in pin ? pin.type : "edge"}
                    position={"position" in pin ? pin.position : null}
                    limit={"limit" in pin ? pin.limit : null}
                    production={"production" in pin ? pin.production : null}
                    fromId={"fromId" in pin ? pin.fromId : null}
                    toId={"toId" in pin ? pin.toId : null}
                    cost={"cost" in pin ? pin.cost : null}
                /> : null}

                <List vertices={vertices} edges={edges} setVertices={setVertices} setEdges={setEdges}/>
            </div>
        </>
    )
}