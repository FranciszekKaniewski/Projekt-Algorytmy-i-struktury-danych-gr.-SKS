import {Config} from "../../confing.ts";

type Method = "GET" | "POST" | "PUT" | "DELETE";
type Response = string | number;

export const Fetch = async (url: string, method: Method, body?: any): Promise<Response> => {
    const res = await fetch(`${Config.backendURL}${url}`,{
        method: method,
        body: JSON.stringify(body),
    })

    console.log(res);

    return await res.text();
}