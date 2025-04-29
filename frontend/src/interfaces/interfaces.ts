export interface Vertex {
    id: number;
    type?: string;
    position: {x: number; y: number};
}

export interface Field extends Vertex{
    production: number;
}
export interface Cross extends Vertex{
    limit: number;
}

export interface Edge extends Vertex{
    id: number;
    fromId: number;
    toId: number;
}

export interface jsonDataFromFile {
    Vertex: Vertex[];
}