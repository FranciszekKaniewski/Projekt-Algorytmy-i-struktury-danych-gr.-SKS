import {Edge} from "../../interfaces/interfaces.ts";
import React, {Dispatch, JSX, SetStateAction, useState} from "react";
import {Fetch} from "../../utils/Fetch.tsx";

type Props = {
    element: Edge;
    vertexOptions: JSX.Element[];
    edges: Edge[];
    setEdges: Dispatch<SetStateAction<Edge[]>>;
}

export const EdgeListElement = ({element,edges,vertexOptions,setEdges}:Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const [fromIdSelect, setFromIdSelect] = useState(element.fromId);
    const [toIdSelect, setToIdSelect] = useState(element.toId);
    const [costInput, setCostInput] = useState(element.cost);

    const deleteHandler = async () => {
        await Fetch(`/api/edges/${element.id}` , "DELETE");
        setEdges(prev => prev.filter(e=> e.id !== element.id));
        setEdges(prevState => prevState.map(e => e.id > element.id ? {...e,id:e.id-1} : e));
    }
    const saveEditHandler = async () => {
        const edge = edges.filter(e=> e.id === element.id)[0];
        edge.toId = toIdSelect;
        edge.fromId = fromIdSelect;
        edge.cost = costInput;
        await Fetch(`/api/edges/${element.id}`, "PATCH", [edge]);

        setEdges(prev => prev.map(e=> e.id === element.id ? edge : e));
        setEditMode(false);
        setIsOpen(false);
    }

    return (
        <>
            <li onClick={()=>setIsOpen(prevState => !prevState)}>
                <span>Droga id:{element.id}</span> <b>E</b>
            </li>
            {isOpen ?
                <div>
                    <span>Z punktu: {!editMode ? element.fromId : <select id="1" onChange={(e)=>setFromIdSelect(Number(e.target.value))} defaultValue={fromIdSelect}>{vertexOptions}</select>}</span> <br/>
                    <span>Z punktu: {!editMode ? element.toId : <select id="2" onChange={(e)=>setToIdSelect(Number(e.target.value))} defaultValue={toIdSelect}>{vertexOptions}</select>}</span> <br/>
                    <span>Koszt naprawy: {!editMode ? element.cost : <input type="number" onChange={(e)=>setCostInput(Number(e.target.value))} value={costInput}/>}</span> <br/>
                    {!editMode ?
                        <button onClick={()=>setEditMode(prev=>!prev)}>Edytuj</button> :
                        <>
                            <button onClick={saveEditHandler}>Zapisz</button>
                            <button onClick={()=>setEditMode(prev=>!prev)}>Cofnij</button>
                        </>
                    }
                    { !editMode && <button onClick={deleteHandler}>Usuń</button>}
                </div> :
                null
            }
        </>
    )
}

export const MemoizedEdgeListElement = React.memo(EdgeListElement);