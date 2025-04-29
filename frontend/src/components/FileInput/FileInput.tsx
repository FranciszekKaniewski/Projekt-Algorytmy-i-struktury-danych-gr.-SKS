import {useState} from "react";
import {Fetch} from "../../utils/Fetch.tsx";
import {Cross, Edge, Field, Vertex} from "../../interfaces/interfaces.ts";
import './FileInput.css'

export const FileInput = () => {
    const [jsonVertexData, setJsonVertexData] = useState<Vertex[]>([]);
    const [jsonEdgesData, setJsonEdgesData] = useState<Edge[]>([]);
    const [message, setMessage] = useState("");

    const sendHandler = async () => {
        const res = await Fetch("/api/vertices","POST",jsonVertexData as Vertex[]);
        setMessage(res as string);

        const res2 = await Fetch("/api/edges","POST",jsonEdgesData as Edge[]);
        setMessage(res2 as string);
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

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
            })
        };
        reader.readAsText(file);

        setJsonVertexData([]);
        setJsonEdgesData([]);
    };

    return (
        <div className="p-4 flex flex-col items-center">
            <span>Test files: </span>
            <a href="/test-file-1.txt" target="_blank"> plik_1</a> |
            <a href="/test-file-2.txt" target="_blank"> plik_2</a>
            <div style={jsonVertexData.length ? {backgroundColor: "#aaeeaa"} : {backgroundColor: "#fefefe"}}
                 className="dropzone">
                <input onChange={e => handleFileChange(e)} type="file" accept=".txt" className="file-input"/>
                <p className="dropzone-text">{!jsonVertexData.length ? "Umieść plik tutaj lub kliknij" : "Plik dodany poprawnie!"}</p>
            </div>
            <button onClick={() => sendHandler()} className="mt-4 p-2 bg-blue-500 text-white rounded">
                Wyślij na backend
            </button>
            <p>{message}</p>
        </div>
    )
}