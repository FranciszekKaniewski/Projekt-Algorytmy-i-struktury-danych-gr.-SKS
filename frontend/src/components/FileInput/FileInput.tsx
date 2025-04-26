import {useState} from "react";
import {Fetch} from "../../utils/Fetch.tsx";
import {Vertex ,jsonDataFromFile} from "../../interfaces/interfaces.ts";

export const FileInput = (props) => {
    const [jsonData, setJsonData] = useState<Vertex[] | null>(null);

    const sendHandler = async () => {
        await Fetch("/api/file","POST",(jsonData as Vertex[])[0]);
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const a = text.split("\n");
            const b = a.map( l => l.split(" "))
            const data = b.map((e,i)=> ({id: i, type: e[0], position: {x: Number(e[1]),y: Number(e[2])}} as Vertex))
            console.log(data);
            setJsonData(data);
        };
        reader.readAsText(file);
    };

    return (
        <div className="p-4">
            <input type="file" accept=".txt" onChange={(e)=>handleFileChange(e)} />
            <br/>
            <button onClick={()=>sendHandler()}  className="mt-4 p-2 bg-blue-500 text-white rounded">
                Wyślij na backend
            </button>
        </div>
    )
}