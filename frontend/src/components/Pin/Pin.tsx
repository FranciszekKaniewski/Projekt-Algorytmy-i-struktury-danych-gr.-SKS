import "./pin.css"
type Props = {
    id: number;
    position: {x: number, y: number};
    type: string;
    production: number|null;
    limit: number|null;
}

export const Pin = ({id,position,type,production,limit}:Props) => (
    <div className="pin">
        <h4>{type} id:{id}</h4>
        <h5>(x:{position.x}, y:{position.y})</h5>
        {production ? <h3>production: {production}</h3> : null}
        {limit ? <h3>limit: {limit}</h3> : null}
    </div>
)