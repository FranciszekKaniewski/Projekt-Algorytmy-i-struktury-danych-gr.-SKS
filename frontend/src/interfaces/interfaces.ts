export interface Vertex {
    id: number;
    type?: string;
    position: {x: number; y: number};
}

export interface jsonDataFromFile {
    Vertex: Vertex[];
}