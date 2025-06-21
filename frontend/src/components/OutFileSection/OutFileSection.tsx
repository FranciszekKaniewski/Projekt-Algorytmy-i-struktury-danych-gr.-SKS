import {Fetch} from "../../utils/Fetch.tsx";
import {KMPResponse} from "../../interfaces/interfaces.ts";

type Props = {
    showRawData: boolean;
    setShowRawData:(p: (prev:boolean) => boolean) => void;
    pattern: string;
    setPattern: (text:string) => void;
    showPaths: boolean;
    filtredMaxFlowOutFile: string;
    setFiltredMaxFlowOutFile: (text: string) => void;
    maxFlowOutFile:string;
}


export const OutFileSection = ({showRawData,setShowRawData,pattern,setPattern,showPaths,filtredMaxFlowOutFile,setFiltredMaxFlowOutFile,maxFlowOutFile}:Props) => {

    const downloadFile = () => {
        const blob = new Blob([filtredMaxFlowOutFile], { type: "text/plain" });
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

    const filterHandler = async () => {
        if (pattern === '') {
            return setFiltredMaxFlowOutFile(maxFlowOutFile);
        }

        const res = await Fetch('/api/KMP', "POST", [{ text: maxFlowOutFile, pattern }]);
        const json: KMPResponse[] = JSON.parse(res as string);

        const rowToLine = new Map<number, string>();
        const rowToMarkers: Map<number, { start: number, end: number }[]> = new Map();

        for (const { row, column, length, lineText } of json) {
            const start = column;
            const end = column + length;

            if (!rowToLine.has(row)) {
                rowToLine.set(row, lineText);
                rowToMarkers.set(row, []);
            }

            rowToMarkers.get(row)!.push({ start, end });
        }

        const highlightedLines: string[] = [];

        for (const [row, line] of rowToLine.entries()) {
            const markers = rowToMarkers.get(row)!;

            markers.sort((a, b) => b.start - a.start);

            let result = line;
            for (const { start, end } of markers) {
                result = result.slice(0, end) + '*' + result.slice(end);
                result = result.slice(0, start) + '*' + result.slice(start);
            }

            highlightedLines.push(result);
        }

        setFiltredMaxFlowOutFile(highlightedLines.join('\n'));
    };

    return(
        <>
            {showPaths &&
                <div className="mt-4 flex gap-4">
                    <button
                        onClick={downloadFile}>Pobierz plik transportu 💾
                    </button>
                    <button
                        onClick={toggleRawData}>{showRawData ? "Ukryj plik transportu 📋" : "Pokaż plik transportu 📋"}
                    </button>
                    <br/>
                    <input className='btn' type="text" onChange={e => setPattern(e.target.value)} value={pattern}/>
                    <button
                        className='refresh-btn'
                        onClick={filterHandler}>
                        Filtruj Plik transportu 🔍
                    </button>
                </div>
            }

            {showRawData && (
                <div className="styled-output" contentEditable={false}>
                    {filtredMaxFlowOutFile.split('\n').map((line, i) => (
                        <div
                            key={i}
                            dangerouslySetInnerHTML={{__html: (line + "\n").replace(/\*(.*?)\*/g, '<span class="highlight">$1</span>')}}
                        />
                    ))}
                </div>
            )}
        </>
    )
}