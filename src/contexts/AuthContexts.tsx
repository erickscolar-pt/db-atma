import { createContext, ReactNode, useState, useEffect } from 'react';
import { destroyCookie, setCookie, parseCookies } from 'nookies'
import Router from 'next/router'
import { api } from '../services/apiClient'
import { toast } from 'react-toastify';

type AuthContextData = {
    usuario: UsuarioProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>
}

type UsuarioProps ={
    idusu_usu?: number;
    nivel_usu?: number;
    cargo_usu?: number;
    token?: string;
}

type Novo ={
    idusu_usu?: number;
    nivel_usu?: number;
    cargo_usu?: number;
    token?: string;
}

type SignInProps = {
    username: string;
    password: string;
}


type SignUpProps = {
    nome: string;
    senha: string;
    nivel: number;
    cargo: number;
}

type AuthProviderProps ={
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

export function signOut(){
    try{
        destroyCookie(undefined, '@nextauth.token')
        sessionStorage.removeItem('id')
        sessionStorage.removeItem('nivel')
        sessionStorage.removeItem('cargo')
        Router.push('/')
    }catch{
        //console.log('erro ao deslogar')
    }
}


export function AuthProvider({ children }: AuthProviderProps){

    const [usuario, setUsuario] = useState<UsuarioProps>()

    const isAuthenticated = !!usuario;

    useEffect(() => {

        // tentar pegar algo no cookie
        const { '@nextauth.token': token } = parseCookies();

        console.log(token)
    
        if(token){
        destroyCookie(undefined, '@nextauth.token')

          api.put('/auth/refreshtoken',{
            oldtoken: token
          }).then(response => {
            const {cargo_usu,idusu_usu,nivel_usu,token } = response.data;

            console.log(cargo_usu)
            console.log(idusu_usu)
            console.log(nivel_usu)
            console.log(token)

            setCookie(undefined,'@nextauth.token', token,{
                maxAge: 60 * 60 * 24 * 30,
                path: "/" // Quais caminhos terao acesso ao cookie
            })
    
            sessionStorage.setItem('id',idusu_usu)
            sessionStorage.setItem('nivel',nivel_usu) 
            sessionStorage.setItem('cargo',cargo_usu) 
            setUsuario({
                cargo_usu,
                idusu_usu,
                nivel_usu,
                token
            })
    
          })
          .catch((err) => {
            console.log(err)
            
            //Se deu erro deslogamos o user.
            signOut();
          })
        }
    
    
      }, [])

    async function signIn({ username, password }: SignInProps){

        ////console.log('login => ' + username)
        ////console.log('senha => ' + password)

        try{
            const response =  await api.post('/auth/signinLDAP',{
                username,
                password
            })


            const {cargo_usu,idusu_usu,nivel_usu,token } = response.data.novo;

            ////console.log(token)
            ////console.log(nivel_usu)


                if (window) { 
                  // set props data to session storage or local storage 
                  sessionStorage.setItem('id',idusu_usu)
                  sessionStorage.setItem('nivel',nivel_usu) 
                  sessionStorage.setItem('cargo',cargo_usu) 
                }



            setCookie(undefined,'@nextauth.token', token,{
                maxAge: 60 * 60 * 24 * 30,
                path: "/" // Quais caminhos terao acesso ao cookie
            })

            setUsuario({
                cargo_usu,
                idusu_usu,
                nivel_usu,
                token
            })

            // Passar para as proximas requisi????es o token
            api.defaults.headers['Authorization'] = `Bearer ${token}`

            toast.success("Bem vindo!")

            //Redirecionar para pagina atendimento
            Router.push('/dashboard')


        }catch(err){
            toast.error("Erro ao acessar.")
            console.log('Erro ao acessar => ' + err)
        }
    }

    async function signUp({ nome, senha, nivel, cargo }: SignUpProps) {
                ////console.log('login => ' + username)
        ////console.log('senha => ' + password)

        try{
            const response =  await api.post('/auth/signup',{
                nome,
                senha,
                nivel,
                cargo
            })

            toast.success("Conta criada com sucesso.")

            Router.push('/')


        }catch(err){
            toast.error("Erro ao cadastrar usuario.")
            //console.log('Erro ao cadastrar => ' + err)
        }
    }


    return(
        <AuthContext.Provider value={{ usuario, isAuthenticated, signIn, signOut, signUp }}>
            {children}
        </AuthContext.Provider>
    )
}