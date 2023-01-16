import axios, { AxiosError } from "axios";
import { parseCookies } from "nookies"; 
import { signOut } from "../contexts/AuthContexts";
import { AuthTokenError } from "./errors/AuthTokenError";

export function setupAPIClient(ctx = undefined){
    let cookies = parseCookies(ctx);

    const api = axios.create({
        //baseURL: 'http://deadpool.atmatec.com.br:8300',
        baseURL: 'http://deadpool.atmatec.com.br:8306',
        //baseURL: 'http://10.250.1.62:8300',
        headers: {
            Authorization: `Bearer ${cookies['@nextauth.token']}`
        }
    })

    api.interceptors.response.use(response => {
        return response;
    }, (error: AxiosError) => {
        if(error.response.status === 401){
            // qualquer erro 401 (nao autorizado) deve deslogar usuario
            if(typeof window !== undefined){
                //chamar a função para deslogar o usuario
                //signOut()
            } else {
                return Promise.reject(new AuthTokenError())
            }
        }

        return Promise.reject(error)

    })

    return api;
}