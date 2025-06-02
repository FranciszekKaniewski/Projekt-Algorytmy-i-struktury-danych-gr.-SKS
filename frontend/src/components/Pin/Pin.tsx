import "./pin.css"
type Props = {
    id: number;
    position: {x: number, y: number} | null;
    type: string;
    production: number|null;
    limit: number|null;
    fromId: number|null;
    toId: number|null;
    cost: number|null;
}

export const Pin = ({id,position,type,production,limit,fromId,toId,cost}:Props) => (
    <div className="pin">
        <h3>
            {type === "inn" ? "Karczma" :
                type === "cross" ? "Skrzyżowanie" :
                    type === "field" ? "Pole" :
                        type === "egde" ? "Droga" :
                            type === "brewery" ? "Browar" : null
            }
            (id:{id}) |
            {position ? ` pozycja: (x: ${position.x}, y:${position.y}) |`:null}
            {(fromId || fromId===0) && (toId || toId===0) ? ` trasa: id:${fromId} --> id:${toId} |`:null}
            {production ? ` produkcja: ${production} |` : null}
            {limit ? ` limit: ${limit} |` : null}
            {cost !== null ? ` koszt naprawy: ${cost} |` : null}
        </h3>
    </div>
)