import {useRef, useState} from "react";
import {Canvas} from "../Canvas/Canvas.tsx";
import {Fetch} from "../../utils/Fetch.tsx";
import {Cross, Edge, Field, Path, Vertex} from "../../interfaces/interfaces.ts";
import {Stage, Layer, Rect, Circle, Line, Text, Arrow} from "react-konva";
import {KonvaEventObject} from "konva/lib/Node";
import {Pin} from "../Pin/Pin.tsx";

import "./map.css";

export const Map = () => {

    //States
    const [isDragging, setIsDragging] = useState(false);
    const [mapPos, setMapPos] = useState({x: 0,y: 0});
    const [pointerPos, setPointerPos] = useState({x: 0,y: 0})
    const [scale, setScale] = useState(1);

    const [vertices, setVertices] = useState<Vertex[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [pin, setPin] = useState<Vertex|Field|Cross|Edge|null>(null);

    const [pathing, setPathing] = useState<Path[]>([]);
    const [showPaths, setShowPaths] = useState<"barley"|"beer"|null>(null);

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

    const refreshHandler = async () => {
        const res = await Fetch('/api/vertices',"GET") as string;
        setVertices(JSON.parse(res));

        const res2 = await Fetch('/api/edges',"GET") as string;
        setEdges(JSON.parse(res2));
    }
    const clearHandler = async () => {
        await Fetch('/api/clear',"POST");
        setPathing([]);
        setVertices([]);
        setEdges([]);
        setShowPaths(null);
    }

    const showDetails = (e: Vertex|Field|Cross|Edge) => {
        if("fromId" in e){
            setPin({id: e.id, fromId: e.fromId, toId: e.toId});
        }
        else if ("limit" in e) {
            setPin({id: e.id, position: e.position, type: e.type, limit: e.limit});
        }
        else if ("production" in e) {
            setPin({id: e.id, position: e.position, type: e.type, production: e.production});
        }else
            setPin({id: e.id, position: e.position, type: e.type});
    }
    const hideDetails = () => {
        setPin(null);
    }

    const maxFlowHandler = async () => {
        if(showPaths === "barley"){
            setShowPaths("beer");
            return;
        }else if(showPaths === "beer"){
            setShowPaths("barley");
            return;
        }

        const res = await Fetch('/api/max-flow',"POST") as string;

        const paths = JSON.parse(res).filter((e:Path[]|{"maxBeerFlow": number}|{"maxBarleyFlow": number}) => !("maxBeerFlow" in e) && !("maxBarleyFlow" in e));

        setShowPaths("barley");
        setPathing(paths);
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
            fill={v.type === 'field' ? 'green' : v.type === 'brewery' ? 'orange' : v.type === 'inn' ? 'red' : 'gray'}
            onMouseEnter={() => showDetails(v)}
            onMouseLeave={() => hideDetails()}
        />
    ))

    const drawE = edges.map(e => {
        const vFrom = vertices.filter(v => v.id == e.fromId)[0];
        const vTo = vertices.filter(v => v.id == e.toId)[0];

        return <Line
            key={"e"+e.id}
            stroke={'grey'}
            points={[vFrom.position.x,vFrom.position.y,vTo.position.x,vTo.position.y]}
            onMouseEnter={() => showDetails(e)}
            onMouseLeave={() => hideDetails()}
        />
    })

    const drawPathing = pathing.filter(e => showPaths === e.transports).map((e,i) => {
        const vFrom = vertices.filter(v => v.id == e.fromId)[0];
        const vTo = vertices.filter(v => v.id == e.toId)[0];

        return (
            <>
                <Text
                    x={(vFrom.position.x+vTo.position.x)/2 - 20}
                    y={(vFrom.position.y+vTo.position.y)/2}
                    fill={'black'}
                    text={e.amount.toFixed(2).toString()}
                    fontSize={12/scale}
                    fontFamily={'Calibri'}
                />
                <Text
                    x={(vFrom.position.x+vTo.position.x)/2 - 20}
                    y={(vFrom.position.y+vTo.position.y)/2}
                    fill={'black'}
                    text={e.amount.toFixed(2).toString()}
                    fontSize={12/scale}
                    fontFamily={'Calibri'}
                />
                <Arrow
                    key={"p"+i}
                    stroke={'red'}
                    points={[vFrom.position.x,vFrom.position.y,vTo.position.x,vTo.position.y-10]}
                    pointerLength={20}
                    pointerWidth={20}
                    // onMouseEnter={() => showDetails(e)}
                    // onMouseLeave={() => hideDetails()}
                />
            </>
        )
    })

    return(
        <>
            <h4 className="mouse-cordinats">
                x: {(pointerPos.x - mapPos.x).toFixed(0)} y: {(pointerPos.y - mapPos.y).toFixed(0)}
            </h4>
            <div>
                <span> {scale} </span>
                <button onClick={() => setScale(prev => prev >= 1 ? prev + 1 : prev * 2)}>+</button>
                <button onClick={() => setScale(prev => prev > 1 ? prev - 1 : prev / 2)}>-</button>
                <button className='refresh-btn' onClick={refreshHandler}>Odźwierz</button>
                <button className='refresh-btn' onClick={clearHandler}>Wyszyść dane</button>
                <button
                    className='refresh-btn'
                    onClick={maxFlowHandler}>
                    {showPaths===null ? "Oblicz MaxFlow" : showPaths==="barley" ? "Pokaż scieszki dla piwa" : "Pokaż scieszki dla jęczmienia"}
                </button>
            </div>

            <div style={{ position: 'relative', width: 800, height: 800, margin: "auto" }}>
                <Canvas draw={drawGrid} />
                <Stage
                    width={800}
                    height={800}
                    onMouseDown={() => setIsDragging(true)}
                    onMouseUp={() => setIsDragging(false)}
                    onMouseMove={mapHandler}
                    style={{ position: 'absolute', top: 0, left: 0 }}
                >
                    <Layer scale={{ x: scale, y: scale }} offset={{ x: -mapPos.x/scale, y: -mapPos.y/scale }}>
                    <Circle radius={6} x={0} y={0} fill='red' />
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
                /> : null}
            </div>
        </>
    )
}