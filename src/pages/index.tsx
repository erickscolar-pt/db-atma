import { FormEvent, useContext, useState } from "react";
import Head from 'next/head';
import styles from '../../styles/Home.module.scss';
import Image from 'next/image';
import imgLogin from '../../public/img-entry-login.png';
import imgLogoAtma from '../../public/logo_atma.png';
import {ButtonEntrar} from '../components/ui/button';

import { AuthContext } from '../contexts/AuthContexts';
import { toast } from "react-toastify";
import { canSSRGuest } from "../utils/canSSRGuest";

export default function Home() {
  const { signIn } = useContext(AuthContext)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    if(username === '' || password === ''){
      toast.warning("Preencha todos os campos!")
      return;
    }

    setLoading(true)

    let data = {
      username,
      password
    }

    await signIn(data)
    setLoading(false)
  }




  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className={styles.container}>
{/*         <div className={styles.loginEsquerda}>
          <Image
          className={styles.imglogin}
          src={imgLogin}
          />
        </div> */}

{/*         <div className={styles.loginDireita}> */}
          <form  onSubmit={handleLogin}>
            <h1 className={styles.titulo}>Login</h1>
            
            <span>E-mail</span>
            <input 
            type="text" 
            placeholder='Digite seu e-mail'
            value={username}
            onChange={ (e)=> setUsername(e.target.value)}/>

            <span>Senha</span>
            <input 
            type="password" 
            placeholder='**********'
            value={password} 
            onChange={ (e)=> setPassword(e.target.value)}/>

            <ButtonEntrar
            type="submit"
            loading={loading}
            >
              Entrar
            </ButtonEntrar>

            <span className={styles.logoAtma}>
              <Image
              src={imgLogoAtma}
              />
            </span>

          </form>
{/*         </div> */}
      </div>
    </>
  )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  
  

  return {
    props: {}
  }
})
