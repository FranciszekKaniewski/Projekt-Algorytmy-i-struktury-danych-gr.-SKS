import React, {useRef, useState} from "react";
import {Fetch} from "../../utils/Fetch.tsx";
import {Cross, Edge, Field, Quadrant, Vertex} from "../../interfaces/interfaces.ts";

type Props = {
    deleteData: () => void;
    fetchData: () => void;
    areData: boolean;
}

export const FileInputSection = ({deleteData,fetchData,areData}:Props) => {
    const [jsonVertexData, setJsonVertexData] = useState<Vertex[]>([]);
    const [jsonEdgesData, setJsonEdgesData] = useState<Edge[]>([]);
    const [jsonQuadrantsData, setJsonQuadrantsData] = useState<Quadrant[]>([]);

    const file = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState("");

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

            await Fetch("/api/quadrants","POST",defaultQuadrants as Quadrant[]);
        }else{
            await Fetch("/api/quadrants","POST",jsonQuadrantsData as Quadrant[]);
        }

        if(!jsonVertexData.length && !jsonEdgesData.length) return
        await Fetch("/api/vertices","POST",jsonVertexData as Vertex[]);

        await Fetch("/api/edges","POST",jsonEdgesData as Edge[]);

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
        }
    };

    return (
        <>
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
                Wyślij na backend ⌯⌲
            </button>
            <button
                onClick={() => deleteData()}
                disabled={areData}
            >
                Wyczyść dane ❌
            </button>
        </>
    )
}