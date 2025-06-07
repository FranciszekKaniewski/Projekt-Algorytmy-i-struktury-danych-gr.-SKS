import {useCallback, useEffect, useRef, useState,} from "react";
import {Fetch} from "../../utils/Fetch.tsx";
import {Edge, Vertex, Path, Quadrant, Pathing} from "../../interfaces/interfaces.ts";
import './FileInput.css'
import {FileInputSection} from "../FileInputSection/FileInputSection.tsx";
import {MaxFlowSection} from "../MaxFlowSection/MaxFlowSection.tsx";
import {OutFileSection} from "../OutFileSection/OutFileSection.tsx";

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

    const [maxFlowOutFile, setMaxFlowOutFile] = useState<string>('text');
    const [filtredMaxFlowOutFile, setFiltredMaxFlowOutFile] = useState<string>(maxFlowOutFile);
    const [showRawData, setShowRawData] = useState(false);
    const [pattern, setPattern] = useState<string>('');

    const fetchData = useCallback(async () => {
        const resV = await Fetch('/api/vertices',"GET") as string;
        setVertices(JSON.parse(resV));

        const resE = await Fetch('/api/edges',"GET") as string;
        setEdges(JSON.parse(resE));

        const resQ = await Fetch('/api/quadrants',"GET") as string;
        setQuadrants(JSON.parse(resQ));
    },[setEdges, setVertices])

    const deleteHandler = async () => {
        await Fetch('/api/clear',"POST");
        setVertices([]);
        setEdges([]);
        setPathing([]);
        setQuadrants([]);
        setShowPaths(null);
        setShowRawData(false);
    }

    const runEffect = useRef(false);
    useEffect(() => {
        if(!runEffect.current){
            (async () => await fetchData())();

            return () => {runEffect.current = true};
        }
    },[fetchData, setEdges, setVertices]);

    return (
        <div className="p-4 flex flex-col items-center">
            <FileInputSection deleteData={deleteHandler} fetchData={fetchData} areData={areData}/>
            <br/>
            <MaxFlowSection
                setPathing={setPathing}
                showPaths={showPaths}
                setShowPaths={setShowPaths}
                areData={areData}
                setMaxFlowOutFile={setMaxFlowOutFile}
                setFiltredMaxFlowOutFile={setFiltredMaxFlowOutFile}
                setPattern={setPattern}
                setShowRawData={setShowRawData}
            />
            <OutFileSection
                showRawData={showRawData}
                setShowRawData={setShowRawData}
                pattern={pattern}
                setPattern={setPattern}
                showPaths={showPaths !== null}
                filtredMaxFlowOutFile={filtredMaxFlowOutFile}
                setFiltredMaxFlowOutFile={setFiltredMaxFlowOutFile}
                maxFlowOutFile={maxFlowOutFile}
            />

        </div>
    )
}