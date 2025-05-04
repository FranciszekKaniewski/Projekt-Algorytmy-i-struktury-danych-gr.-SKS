import "./pin.css"
type Props = {
    id: number;
    position: {x: number, y: number} | null;
    type: string;
    production: number|null;
    limit: number|null;
    fromId: number|null;
    toId: number|null;
}

export const Pin = ({id,position,type,production,limit,fromId,toId}:Props) => (
    <div className="pin">
        <h4>{type} id:{id}</h4>

        {position ? <h5>Pozycja (x: {position.x}, y:{position.y})</h5> :
            <h5>Z id:{fromId} do id:{toId}</h5>}
        {production ? <h3>production: {production}</h3> : null}
        {limit ? <h3>limit: {limit}</h3> : null}
    </div>
)