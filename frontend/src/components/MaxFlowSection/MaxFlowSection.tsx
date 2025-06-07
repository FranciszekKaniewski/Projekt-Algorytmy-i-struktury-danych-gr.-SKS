import {Fetch} from "../../utils/Fetch.tsx";
import {Path, Pathing} from "../../interfaces/interfaces.ts";
import {useState} from "react";

type Props = {
    setPathing: (data:Path[]) => void;
    showPaths: Pathing;
    setShowPaths: (arg0: Pathing) => void;
    areData: boolean;
    setMaxFlowOutFile: (text:string)=>void;
    setFiltredMaxFlowOutFile: (text:string) => void;
    setPattern: (pattern:string) => void;
    setShowRawData: (b:boolean)=>void;
}

export const MaxFlowSection = ({setPathing,showPaths,setShowPaths,areData,setMaxFlowOutFile,setFiltredMaxFlowOutFile,setPattern,setShowRawData}:Props) => {

    const [maxFlow, setMaxFlow] = useState({barley:0,beer:0});

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
        setFiltredMaxFlowOutFile(text);
    }

    return(
        <>
            {showPaths?.costs !== true ? <button
                className='refresh-btn'
                disabled={areData}
                onClick={() => maxFlowHandler(false)}>
                {showPaths === null ? "Oblicz MaxFlow 📊" : showPaths.type === "barley" ? "Pokaż scieszki dla piwa 🍺" : "Pokaż scieszki dla jęczmienia 🌾"}
            </button> : null}
            {showPaths?.costs !== false ? <button
                className='refresh-btn'
                disabled={areData}
                onClick={() => maxFlowHandler(true)}>
                {showPaths === null ? "Oblicz MaxFlow z min. kosztami 📊💸" : showPaths.type === "barley" ? "Pokaż scieszki dla piwa 🍺" : "Pokaż scieszki dla jęczmienia 🌾"}
            </button> : null}
            {showPaths !== null ?
                <button
                    className='refresh-btn'
                    onClick={() => {setShowPaths(null); setPattern(""); setShowRawData(false);}}>
                    ❌
                </button> : null
            }
            {showPaths?.type === "barley" ? <h3>Maksymalny przepływ jęczmienia do browarów wynosi: {maxFlow.barley} 🌾</h3> :
                showPaths?.type === "beer" ? <h3>Maksymalny przepływ piwa do karczm wynosi: {maxFlow.beer} 🍺</h3> : null
            }
        </>
    )
}