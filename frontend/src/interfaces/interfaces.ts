export interface Vertex {
    id: number;
    type: string;
    position: {x: number; y: number};
}

export interface Field extends Vertex{
    production: number;
}
export interface Cross extends Vertex{
    limit: number;
}

export interface Edge{
    id: number;
    fromId: number;
    toId: number;
    cost: number;
}

export interface Path{
    fromId: number;
    toId: number;
    amount: number;
    transports: string;
}

export interface jsonDataFromFile {
    Vertex: Vertex[];
}

export interface Quadrant {
    production: number;
    points: {x: number; y: number}[];
}

export type Pathing = {type:"barley"|"beer", costs: boolean} | null
