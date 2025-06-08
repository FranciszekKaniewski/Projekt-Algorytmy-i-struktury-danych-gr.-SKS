import React, {Dispatch, SetStateAction, useState} from "react";
import {ArrowIcon} from "../../assets/icons/Arrow.tsx"
import {Cross, Edge, Field, Vertex} from "../../interfaces/interfaces.ts";

import "./list.css"
import {MemoizedVertexListElement} from "../VertexListElement/VertexListElement.tsx";
import {FetchStatus} from "../../utils/Fetch.tsx";
import {MemoizedEdgeListElement} from "../EdgeListElement/EdgeListElement.tsx";

type Props = {
    vertices: Vertex[];
    edges: Edge[];
    setVertices: Dispatch<SetStateAction<Vertex[]>>;
    setEdges: Dispatch<SetStateAction<Edge[]>>;
}

export const List = ({vertices,edges,setVertices,setEdges}:Props) => {

    const [isOpen, setIsOpen] = useState<boolean>(false)

    const [select, setSelect] = useState<string>("field");
    const [addingMode, setAddingMode] = useState(false);

    const [formX, setFormX] = useState<number>(0)
    const [formY, setFormY] = useState<number>(0)
    const [formProd, setFormProd] = useState<number>(0)
    const [formLimit, setFormLimit] = useState<number>(0)
    const [fromFrom, setFromFrom] = useState<number>(0)
    const [toForm, setToForm] = useState<number>(0)

    const addOneVertex = async () => {

        const newVertex: Field|Cross|Vertex =
        (select === "field") ?
            {id: vertices.length,type: select.toUpperCase(), position: {x:formX ?? 0, y:formY?? 0}, production: formProd ?? 0} :
        (select === "cross") ?
            {id: vertices.length,type: select.toUpperCase(), position: {x:formX ?? 0, y:formY ?? 0}, limit: formLimit ?? 0} :
        // (select === "inn" || select === "brewery") ?
            {id: vertices.length,type: select.toUpperCase(), position: {x:formX ?? 0, y:formY ?? 0}}

        const res = await FetchStatus("/api/vertices", "POST", [newVertex]);
        if(res.status === 200) setVertices(prevState => [...prevState, newVertex]);
    }

    const addOneEdge = async () => {
        const newEdge:Edge = {id: edges.length,fromId:fromFrom ?? 0, toId: toForm ?? 0, cost: 0}
        const res = await FetchStatus("/api/edges", "POST", [newEdge]);
        if(res.status === 200) setEdges(prevState => [...prevState, newEdge]);
    }

    const openHandler = () => {
        setIsOpen(prevState => !prevState)
    }

    const sendHandler = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if(select !== "edge") await addOneVertex()
        else await addOneEdge();

        setFormX(0);
        setFormY(0);
        setFormProd(0);
        setFormLimit(0);
        setFromFrom(0);
        setToForm(0);
        setAddingMode(false);
    }

    const listStyle = isOpen ? {zIndex: 0, right: -255} : {zIndex: 0, right: -5};
    const handlerStyle = isOpen ? {rotate: "-180deg"} : {rotate: "0deg"};

    const vElements = vertices.map(e=><MemoizedVertexListElement key={e.id} element={e} setVertices={setVertices} setEdges={setEdges}/>)

    const eElements = edges.map(e=><MemoizedEdgeListElement key={e.id} element={e} edges={edges}  vertices={vertices} setEdges={setEdges}/>)

    return(
        <div className="list" style={listStyle}>
            <h3>Lista</h3>
            <div className="scroll-list">
            {addingMode && <div>
                <form>
                    <select onChange={e => setSelect(e.target.value)} value={select}>
                        <option value="field">Pole</option>
                        <option value="inn">Karczma</option>
                        <option value="brewery">Browar</option>
                        <option value="cross">Skrzyrzowanie</option>
                        <option value="edge">Droga</option>
                    </select>
                    {select !== 'edge' && <div>
                        X: <input value={formX??undefined} onChange={e => setFormX(Number(e.target.value))} required
                                  className='add' type="number"/> <br/>
                        Y: <input value={formY??undefined} onChange={e => setFormY(Number(e.target.value))} required
                                  className='add' type="number"/>
                    </div>}
                    {select === 'field' && <div>
                        Produkcja*: <input value={formProd??undefined} onChange={e => setFormProd(Number(e.target.value))}
                                           className='add' type="number"/>
                    </div>}
                    {select === 'cross' && <div>
                        Limit: <input value={formLimit??undefined} onChange={e => setFormLimit(Number(e.target.value))} required
                                      className='add' type="number"/>
                    </div>}
                    {select === 'edge' && <div>
                        Od: <input value={fromFrom??undefined} onChange={e => setFromFrom(Number(e.target.value))} required
                                      className='add' type="number"/> <br/>
                        Do: <input value={toForm??undefined} onChange={e => setToForm(Number(e.target.value))} required
                                     className='add' type="number"/>
                    </div>}
                </form>
                <button onClick={e => sendHandler(e)}>Dodaj</button>
            </div>
            }
            {<button onClick={() => setAddingMode(prev => !prev)}> {!addingMode ? 'Dodaj Element' : '❌'}</button>}

            <div className="handler" onClick={openHandler}>
            <div className="arrow" style={handlerStyle}>
                    <ArrowIcon/>
                </div>
            </div>
            <ul>
                {vElements.length > 0 ? <h4>Punkty:</h4> : null }
                {vElements}
                {eElements.length > 0 ? <h4>Trasy:</h4> : null}
                {eElements}
            </ul>
            </div>
        </div>
    )
}