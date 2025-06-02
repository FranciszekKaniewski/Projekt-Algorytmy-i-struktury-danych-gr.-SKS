import React, {useCallback, useEffect, useRef, useState,} from "react";
import {Fetch} from "../../utils/Fetch.tsx";
import {Cross, Edge, Field, Vertex, Path, Quadrant, Pathing} from "../../interfaces/interfaces.ts";
import './FileInput.css'

type Props = {
    setVertices: (data:Vertex[])=> void;
    setEdges: (data:Edge[]) => void;
    setPathing: (data:Path[]) => void;
    showPaths: Pathing;
    setShowPaths: (arg0: Pathing) => void;
    setQuadrants: (data:Quadrant[]) => void;
    areData: boolean;
}

export const FileInput = ({setVertices,setEdges,setPathing,showPaths,setShowPaths, setQuadrants, areData}:Props) => {
    const [jsonVertexData, setJsonVertexData] = useState<Vertex[]>([]);
    const [jsonEdgesData, setJsonEdgesData] = useState<Edge[]>([]);
    const [jsonQuadrantsData, setJsonQuadrantsData] = useState<Quadrant[]>([]);
    const [messages, setMessages] = useState<string[]>([]);

    const [maxFlow, setMaxFlow] = useState({barley:0,beer:0});

    const [maxFlowOutFile, setMaxFlowOutFile] = useState<string>('text');
    const [showRawData, setShowRawData] = useState(false);

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

        if(jsonQuadrantsData.length < 4){
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

            const res3 = await Fetch("/api/quadrants","POST",defaultQuadrants as Quadrant[]);
            setMessages(prevState => [...prevState, res3 as string]);
        }else{
            const res3 = await Fetch("/api/quadrants","POST",jsonQuadrantsData as Quadrant[]);
            setMessages(prevState => [...prevState, res3 as string]);
        }

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

    const parseFileContent = (text: string) => {
        setJsonVertexData([]);
        setJsonEdgesData([]);
        setJsonQuadrantsData([]);

        const linesArr = text.split("\n");
        const wordsArr = linesArr
            .map(l => l.trim())
            .filter(l => l.length > 0)
            .map(l => l.split(" "));

        wordsArr.forEach(e => {
            if (e[0] === "F")
                setJsonVertexData(pS => (
                    [...pS, ({ type: e[0], production: Number(e[3] ?? 0), position: { x: Number(e[1]), y: Number(e[2]) } } as Field)]
                ))
            else if (e[0] === "C")
                setJsonVertexData(pS => (
                    [...pS, ({ type: e[0], limit: Number(e[3] ?? 0), position: { x: Number(e[1]), y: Number(e[2]) } } as Cross)]
                ))
            else if (e[0] === "B" || e[0] === "I")
                setJsonVertexData(pS => (
                    [...pS, ({ type: e[0], position: { x: Number(e[1]), y: Number(e[2]) } } as Vertex)]
                ))
            else if (e[0] === "E") {
                setJsonEdgesData(prevState => [...prevState, { fromId: e[1], toId: e[2], cost: e[3] ? Number(e[3]) : 0 }] as Edge[]);
            }
            else if (e[0] === "Q") {
                const production = Number(e[e.length - 1]);
                const points: { x: number, y: number }[] = [];

                let px = 0;
                let x = true;
                for (const string of e.slice(1, -1)) {
                    if (x) px = Number(string);
                    else {
                        const py = Number(string);
                        points.push({ x: px, y: py });
                    }
                    x = !x;
                }
                setJsonQuadrantsData(prevState => [...prevState, { points, production }] as Quadrant[]);
            }
        });
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const f = event.target.files?.[0];
        if (!f) return;
        setFileName(f.name);

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            parseFileContent(text);
        };
        reader.readAsText(f);
    };

    const loadExampleFile = async (name: string) => {
        try {
            const res = await fetch(name);
            const text = await res.text();
            setFileName(name);
            parseFileContent(text);
        } catch (err) {
            console.error("Błąd wczytywania pliku:", err);
            setMessages(prev => [...prev, "Nie udało się wczytać pliku plik1.txt"]);
        }
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

    const maxFlowHandler = async (costs: boolean) => {
        if(showPaths?.type === "barley"){
            setShowPaths({type: "beer", costs});
            return;
        }else if(showPaths?.type === "beer"){
            setShowPaths({type: "barley", costs});
            return;
        }

        const res = await Fetch(!costs ? '/api/max-flow' : '/api/min-cost-max-flow',"GET") as string;

        const paths = JSON.parse(res).filter((e:Path[]|{"maxBeerFlow": number}|{"maxBarleyFlow": number}) => {
            if(!("maxBeerFlow" in e) && !("maxBarleyFlow" in e)) return true;
            else{
                if("maxBeerFlow" in e)
                    setMaxFlow(prevState => ({barley: prevState.barley, beer: e.maxBeerFlow}))
                else
                    setMaxFlow(prevState => ({barley: e.maxBarleyFlow, beer: prevState.beer}));
            }
        });

        setShowPaths({type: "barley", costs});
        setPathing(paths);

        if (!JSON.parse(res)) return;

        let text = "=== Max Flow Result ===\n\n";
        let textPaths = "";

        let pathCount = 1;

        JSON.parse(res).forEach((entry:Path|{"maxBeerFlow": number}|{"maxBarleyFlow": number}) => {
            if ("maxBeerFlow" in entry) {
                text += `Maksymalny przepływ piwa: ${entry.maxBeerFlow} 🍺\n\n`;
            } else if ("maxBarleyFlow" in entry) {
                text += `Maksymalny przepływ jęczmienia: ${entry.maxBarleyFlow} 🌾\n\n`;
            } else {
                textPaths += `Ścieżka ${pathCount++}: Przewieź ${entry.amount} ${entry.transports === "beer" ? "Piwa" : "Jęczmienia"} z punktu ${entry.fromId} do ${entry.toId} \n`;
            }

            if ("minCostBarleyTransport" in entry) {
                text += `Minimalny koszt naprawy scierzek dla przewozu jęczmienia: ${entry.minCostBarleyTransport} 🌾\n\n`;
            }else if ("minCostBeerTransport" in entry) {
                text += `Minimalny koszt naprawy scierzek dla przewozu piwa: ${entry.minCostBeerTransport} 🍺\n\n`;
            }
        });

        text += textPaths;
        setMaxFlowOutFile(text);
    }

    const downloadFile = () => {
        const blob = new Blob([maxFlowOutFile], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "maxflow_result.txt";
        a.click();

        URL.revokeObjectURL(url);
    };

    const toggleRawData = () => {
        setShowRawData(prev => !prev);
    };

    return (
        <div className="p-4 flex flex-col items-center">
            <span>Test files: </span>
            <a href="/test-file-1.txt" target="_blank" onClick={() => loadExampleFile("/test-file-1.txt")}> plik_1</a> |
            <a href="/test-file-2.txt" target="_blank" onClick={() => loadExampleFile("/test-file-2.txt")}> plik_2</a> |
            <a href="/test-file-3.txt" target="_blank" onClick={() => loadExampleFile("/test-file-3.txt")}> plik_3</a>

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
            <button
                onClick={() => deleteHandler()}
                disabled={areData}
            >
                Wyczyść dane
            </button>
            <br/>
            {showPaths?.costs !== true ? <button
                className='refresh-btn'
                onClick={() => maxFlowHandler(false)}>
                {showPaths === null ? "Oblicz MaxFlow" : showPaths.type === "barley" ? "Pokaż scieszki dla piwa 🍺" : "Pokaż scieszki dla jęczmienia 🌾"}
            </button> : null}
            {showPaths?.costs !== false ? <button
                className='refresh-btn'
                onClick={() => maxFlowHandler(true)}>
                {showPaths === null ? "Oblicz MaxFlow z min. kosztami" : showPaths.type === "barley" ? "Pokaż scieszki dla piwa 🍺" : "Pokaż scieszki dla jęczmienia 🌾"}
            </button> : null}
            {showPaths !== null ?
                <button
                    className='refresh-btn'
                    onClick={() => setShowPaths(null)}>
                    ❌
                </button> : null
            }
            {showPaths?.type === "barley" ? <h3>Maksymalny przepływ jęczmienia do browarów wynosi: {maxFlow.barley} 🌾</h3> :
                showPaths?.type === "beer" ? <h3>Maksymalny przepływ piwa do karczm wynosi: {maxFlow.beer} 🍺</h3> : null
            }
            {showPaths !== null &&
                <div className="mt-4 flex gap-4">
                    <button
                        onClick={downloadFile}>Pobierz plik transportu
                    </button>
                    <button
                        onClick={toggleRawData}>{showRawData ? "Ukryj plik transportu" : "Pokaż plik transportu"}</button>
                </div>
            }

            {showRawData && <textarea value={maxFlowOutFile}></textarea>}
        </div>
    )
}