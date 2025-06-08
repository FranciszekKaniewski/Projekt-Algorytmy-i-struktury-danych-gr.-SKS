import {Config} from "../../confing.ts";
import {Vertex} from "../interfaces/interfaces.ts";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type Response = string | number | Vertex[];

export const Fetch = async (url: string, method: Method, body?: any): Promise<Response> => {
    const res = await fetch(`${Config.backendURL}${url}`,{
        method: method,
        body: JSON.stringify(body),
    })

    return await res.text();
}

type ResponseStatus = { body: Promise<string>, status:number };
export const FetchStatus = async (url: string, method: Method, body?: any): Promise<ResponseStatus> => {
    const res = await fetch(`${Config.backendURL}${url}`,{
        method: method,
        body: JSON.stringify(body),
    })

    return {body: res.text(),status: res.status};
}