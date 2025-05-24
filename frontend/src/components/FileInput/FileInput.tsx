import React, {useCallback, useEffect, useRef, useState,} from "react";
import {Fetch} from "../../utils/Fetch.tsx";
import {Cross, Edge, Field, Vertex, Path, Quadrant} from "../../interfaces/interfaces.ts";
import './FileInput.css'

type Props = {
    setVertices: (data:Vertex[])=> void;
    setEdges: (data:Edge[]) => void;
    setPathing: (data:Path[]) => void;
    showPaths: "barley"|"beer"|null;
    setShowPaths: (data:"barley"|"beer"|null) => void;
    setQuadrants: (data:Quadrant[]) => void;
}

export const FileInput = ({setVertices,setEdges,setPathing,showPaths,setShowPaths, setQuadrants}:Props) => {
    const [jsonVertexData, setJsonVertexData] = useState<Vertex[]>([]);
    const [jsonEdgesData, setJsonEdgesData] = useState<Edge[]>([]);
    const [jsonQuadrantsData, setJsonQuadrantsData] = useState<Quadrant[]>([]);
    const [messages, setMessages] = useState<string[]>([]);

    const file = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState("");

    const runEffect = useRef(false);

    const fetchData = useCallback(async () => {
        const resV = await Fetch('/api/vertices',"GET") as string;
        setVertices(JSON.parse(resV));

        const resE = await Fetch('/api/edges',"GET") as string;
        setEdges(JSON.parse(resE));

        const resQ = await Fetch('/api/quadrants',"GET") as string;
        setQuadrants(JSON.parse(resQ));
    },[setEdges, setVertices])

    useEffect(() => {
        if(!runEffect.current){
            (async () => await fetchData())();

            return () => {runEffect.current = true};
        }
    },[fetchData, setEdges, setVertices]);

    const sendHandler = async () => {

        const res3 = await Fetch("/api/quadrants","POST",jsonQuadrantsData as Quadrant[]);
        setMessages(prevState => [...prevState, res3 as string]);

        if(!jsonVertexData.length && !jsonEdgesData.length) return
        const res = await Fetch("/api/vertices","POST",jsonVertexData as Vertex[]);
        setMessages(prevState => [...prevState, res as string]);

        const res2 = await Fetch("/api/edges","POST",jsonEdgesData as Edge[]);
        setMessages(prevState => [...prevState, res2 as string]);

        setJsonVertexData([]);
        setJsonEdgesData([]);
        setJsonQuadrantsData([]);
        if(file.current){
            file.current.value = "";
        }
        setFileName("");

        await fetchData();
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const f = event.target.files?.[0];
        if (!f) return;
        setFileName(f.name);

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const linesArr = text.split("\n");
            const wordsArr = linesArr.map( l => l.split(" "))

            wordsArr.forEach(e=> {
                if(e[0] === "F")
                    setJsonVertexData(pS => (
                        [...pS, ({type: e[0], production: Number(e[3] ?? 0), position: {x: Number(e[1]),y: Number(e[2])}} as Field)]
                    ))
                else if(e[0] === "C")
                    setJsonVertexData( pS => (
                        [...pS, ({type: e[0], limit: Number(e[3] ?? 0), position: {x: Number(e[1]),y: Number(e[2])}} as Cross)]
                    ))
                else if(e[0] === "B" || e[0] === "I")
                    setJsonVertexData( pS => (
                        [...pS, ({type: e[0], position: {x: Number(e[1]),y: Number(e[2])}} as Vertex)]
                    ))
                else if(e[0] === "E") {
                    setJsonEdgesData(prevState => [...prevState, {fromId: e[1], toId: e[2]}] as Edge[]);
                }
                else if(e[0] === "Q") {
                    const production = Number(e[e.length - 1]);
                    const points:{x:number, y:number}[] = [];

                    let px = 0;
                    let x = true;
                    for (const string of e.slice(1, -1)) {
                        if(x) px = Number(string);
                        else {
                            const py = Number(string);
                            points.push({ x: px, y: py });
                        }
                        x = !x;
                    }
                    setJsonQuadrantsData(prevState => [...prevState, {points,production}] as Quadrant[]);
                }
            })

            if(jsonVertexData.length < 4){
                const defaultQuadrants = [
                        {
                            "points": [{"y": 0.0, "x": 0.0}, {"x": 1000.0, "y": 0.0}, {"y": 1000.0, "x": 1000.0}, {"y": 1000.0, "x": 0.0}],
                            "production": 100.0},
                        {
                            "points": [{"x": 0.0, "y": 0.0}, {"y": 0.0, "x": -1000.0}, {"x": -1000.0, "y": 1000.0}, {"x": 0.0, "y": 1000.0}],
                            "production": 100.0
                        },
                        {
                            "points": [{"y": 0.0, "x": 0.0}, {"x": -1000.0, "y": 0.0}, {"y": -1000.0, "x": -1000.0}, {"y": -1000.0, "x": 0.0}],
                            "production": 100.0},
                        {
                            "points": [{"y": 0.0, "x": 0.0}, {"x": 1000.0, "y": 0.0}, {"y": -1000.0, "x": 1000.0}, {"y": -1000.0, "x": 0.0}],
                            "production": 100.0
                        }
                ]
                setJsonQuadrantsData(defaultQuadrants);
            }
        };
        reader.readAsText(f);

        setJsonVertexData([]);
        setJsonEdgesData([]);
    };

    const deleteHandler = async () => {
        const res = await Fetch('/api/clear',"POST");
        setVertices([]);
        setEdges([]);
        setPathing([]);
        setQuadrants([]);
        setShowPaths(null);
        if(file.current){
            file.current.value = "";
        }
        setFileName("");
        setMessages([res as string]);
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

    return (
        <div className="p-4 flex flex-col items-center">
            <span>Test files: </span>
            <a href="/test-file-1.txt" target="_blank"> plik_1</a> |
            <a href="/test-file-2.txt" target="_blank"> plik_2</a> |
            <a href="/test-file-3.txt" target="_blank"> plik_3</a>
            <div style={fileName.length ? {backgroundColor: "#aaeeaa"} : {backgroundColor: "#fefefe"}}
                 className="dropzone">
                <input
                    onChange={e => handleFileChange(e)}
                    ref={file} type="file"
                    accept=".txt"
                    className="file-input"
                />
                <p className="dropzone-text">{!fileName.length ? "Umieść plik tutaj lub kliknij" : "Plik dodany poprawnie!"}</p>
            </div>
            <button onClick={() => sendHandler()} className="mt-4 p-2 bg-blue-500 text-white rounded"
                    disabled={!jsonVertexData.length && !jsonEdgesData.length}>
                Wyślij na backend
            </button>
            <button onClick={() => deleteHandler()} className="mt-4 p-2 bg-blue-500 text-white rounded">
                Wyczyść dane
            </button>
            {messages.map((m, i) => <p key={i}>{m}</p>)}
            <button
                className='refresh-btn'
                onClick={maxFlowHandler}>
                {showPaths === null ? "Oblicz MaxFlow" : showPaths === "barley" ? "Pokaż scieszki dla piwa" : "Pokaż scieszki dla jęczmienia"}
            </button>
        </div>
    )
}