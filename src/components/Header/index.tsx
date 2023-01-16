import { useContext,useEffect, useState  } from 'react'
import styles from './styles.module.scss';
import logo from '../../../public/logo.png'
import Link from 'next/link';
import Image from 'next/image';
import { AuthContext } from '../../contexts/AuthContexts';
import { useRouter } from 'next/router';

export default function Header(){

    const router = useRouter()
    const { signOut } = useContext(AuthContext)
    const [nivelid, setNivelId] = useState(0)
    const [cargo, setCargo] = useState(0)

    useEffect(() => {
        if (window) { 
          // set props data to session storage or local storage  
          setNivelId(parseInt(sessionStorage.getItem('nivel')))
          setCargo(parseInt(sessionStorage.getItem('nivel')))
        }
    }, []);

    let nivel = nivelid;
    if(isNaN(nivel)){
        if(process.browser){
            console.log('refresh')
            router.reload();
        }
    }

    return(
        <>
        <header className={styles.sidebar}>
        <div className={styles.group}>
                <div className={styles.logo}>
                    <Image alt='logo atma' src={logo}/>
                </div>
                <Link href="/dashboard"><button type="button">Equipes</button></Link>
                <Link href="/atualizacoes"><button type="button">Atualizações</button></Link>

                {+nivel == 1?
                <>
                <Link href="/novousuario"><button type="button" >Novo Usuario</button></Link>
                <Link href="/novousuariocentrocusto"><button type="button" >Usuario Centro de Custo</button></Link>  
                <Link href="/alterarusuario"><button type="button" >Alterar Usuario</button></Link>  
                </>
                :<></>       
                }

        </div>
        <div className={styles.exit} onClick={signOut}><h1>Sair</h1></div>
        </header>
        </>
    )
}
