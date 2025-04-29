import {useState} from "react";
import {Fetch} from "../../utils/Fetch.tsx";
import {Cross, Field, Vertex} from "../../interfaces/interfaces.ts";
import './FileInput.css'

export const FileInput = () => {
    const [jsonData, setJsonData] = useState<Vertex[] | null>(null);
    const [message, setMessage] = useState("");

    const sendHandler = async () => {
        const res = await Fetch("/api/vertices","POST",jsonData as Vertex[]);
        setMessage(res as string);
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const linesArr = text.split("\n");
            const wordsArr = linesArr.map( l => l.split(" "))
            // if("ABC".includes(b[0][0]))

            const data = wordsArr.map(e=> {
                if(e[0] === "F")
                    return ({type: e[0], production: Number(e[3] ?? 0), position: {x: Number(e[1]),y: Number(e[2])}} as Field)
                else if(e[0] === "C")
                    return ({type: e[0], limit: Number(e[3] ?? 0), position: {x: Number(e[1]),y: Number(e[2])}} as Cross)

                return ({type: e[0], position: {x: Number(e[1]),y: Number(e[2])}} as Vertex)
            })

            console.log(data);
            setJsonData(data);
        };
        reader.readAsText(file);
    };

    return (
        <div className="p-4 flex flex-col items-center">
            <div style={jsonData ?{backgroundColor: "#aaeeaa"}:{backgroundColor: "#fefefe"}} className="dropzone">
                <input onChange={e => handleFileChange(e)} type="file" accept=".txt" className="file-input"/>
                <p className="dropzone-text">{!jsonData ? "Umieść plik tutaj lub kliknij" : "Plik dodany poprawnie!"}</p>
            </div>
            <button onClick={() => sendHandler()} className="mt-4 p-2 bg-blue-500 text-white rounded">
                Wyślij na backend
            </button>
            <p>{message}</p>
        </div>
    )
}