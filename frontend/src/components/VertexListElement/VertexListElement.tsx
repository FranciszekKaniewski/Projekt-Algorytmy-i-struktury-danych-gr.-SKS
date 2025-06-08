import {Translate} from "../../utils/Translate.ts";
import {Cross, Edge, Field, Vertex} from "../../interfaces/interfaces.ts";
import React, {Dispatch, SetStateAction, useState} from "react";
import {Fetch} from "../../utils/Fetch.tsx";

type Props = {
    element: Vertex|Cross|Field;
    setVertices: Dispatch<SetStateAction<Vertex[]>>;
    setEdges: Dispatch<SetStateAction<Edge[]>>;
}

export const VertexListElement = ({element,setVertices,setEdges}: Props) => {

    const [isOpen, setIsOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const [positionInputValue, setPositionInputValue] = useState({x:0,y:0});

    const [productionInput, setProductionInput] = useState<number>(
        element.type.toUpperCase() === "FIELD" ? (element as Field).production : 0
    );
    const [limitInput, setLimitInput] = useState<number>(
        element.type.toUpperCase() === "CROSS" ? (element as Cross).limit : 0
    );


    const editOneVertex = async (id: number, newVertex: Vertex|Cross|Field) => {
        await Fetch("/api/vertices/" + id, "PATCH", [{...newVertex}]);
        setVertices((prevState: Vertex[]) => prevState.map(v => (v.id === id ? newVertex : v)));
    }
    const deleteOneVertex = async (id: number) => {
        await Fetch("/api/vertices/" + id, "DELETE");
        setEdges(prevState => prevState.filter(e => e.fromId !== id && e.toId !== id))
        setEdges(prevState => prevState.map(e => {
            if(e.fromId>id && e.toId > id) return {...e,fromId:e.fromId-1,toId:e.toId-1};
            if(e.fromId>id && e.toId < id) return {...e,fromId:e.fromId-1};
            if(e.fromId<id && e.toId > id) return {...e,toId:e.toId-1};

            return e;
        }))

        setVertices(prevState => prevState.filter(e => e.id !== id));
        setVertices(prevState => prevState.map(e => e.id>id ? {...e,id:e.id-1} : e));
    }


    const deleteHandler = async () => {
        await deleteOneVertex(element.id);
    }
    const editHandler = () => {
        setPositionInputValue((element as Vertex).position)
        setEditMode(prevState => !prevState)
    }
    const saveEditHandler = async () => {
        if(element.type.toUpperCase() === "CROSS"){
            await editOneVertex(element.id, {...element as Vertex, position: positionInputValue, limit: limitInput});
        }else if(element.type.toUpperCase() === "FIELD"){
            await editOneVertex(element.id, {...element as Vertex, position: positionInputValue, production: productionInput});
        }else{
            await editOneVertex(element.id, {...element as Vertex, position: positionInputValue});
        }
        setEditMode(prevState => !prevState)
    }


    const style =
        {backgroundColor:
                element.type.toUpperCase() === 'FIELD' ? '#aea' :
                    element.type.toUpperCase() === 'CROSS' ? '#ccc' :
                        element.type.toUpperCase() === 'INN' ? '#eaa' : '#eea'
        };

    return (
        <>
            <li style={style} onClick={()=>setIsOpen(prevState => !prevState)}>
                <span>{Translate(element.type)} id:{element.id}</span> <b>V</b>
            </li>
            {isOpen && "position" in element ?
                <div>
                    <span>
                        X: {editMode ?
                        <input
                            type="number"
                            placeholder={String(element.position.x)}
                            value={positionInputValue.x}
                            onChange={(e) => setPositionInputValue(prevState => ({
                                x: Number(e.target.value),
                                y: prevState.y
                            }))}
                        /> :
                        <b>{element.position.x}</b>}
                    </span>
                    <br/>
                    <span>
                        Y: {editMode ?
                        <input
                            type="number"
                            placeholder={String(element.position.y)}
                            value={positionInputValue.y}
                            onChange={(e) => setPositionInputValue(prevState => ({
                                x: prevState.x,
                                y: Number(e.target.value)
                            }))}
                        /> :
                        <b>{element.position.y}</b>}
                    </span>
                    <br/>
                    {element.type.toUpperCase() === 'FIELD' &&
                        <><span>
                        Produkcja*: {editMode ?
                            <input
                                type="number"
                                placeholder={String((element as Field).production)}
                                value={productionInput}
                                onChange={(e) => setProductionInput(Number(e.target.value))}
                            /> :
                            <b>{(element as Field).production}</b>}
                        </span><br/></>
                    }
                    {element.type.toUpperCase() === 'CROSS' &&
                        <><span>
                        Limit: {editMode ?
                            <input
                                type="number"
                                placeholder={String((element as Cross).limit)}
                                value={limitInput}
                                onChange={(e) => setLimitInput(Number(e.target.value))}
                            /> :
                            <b>{(element as Cross).limit}</b>}
                        </span><br/></>
                    }
                    {!editMode ?
                        <button onClick={editHandler}>Edytuj</button> :
                        <>
                            <button onClick={saveEditHandler}>Zapisz</button>
                            <button onClick={editHandler}>Cofnij</button>
                        </>
                    }
                    {!editMode && <button onClick={deleteHandler}>Usuń</button>}
                </div>
                : null}
        </>
    )
}

export const MemoizedVertexListElement = React.memo(VertexListElement);