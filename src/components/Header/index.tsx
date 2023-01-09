import { useContext  } from 'react'
import styles from './styles.module.scss';
import logo from '../../../public/logo.png'
import Link from 'next/link';
import Image from 'next/image';
import { AuthContext } from '../../contexts/AuthContexts';
import { useRouter } from 'next/router';

export default function Header(){

    const router = useRouter()
    const { signOut } = useContext(AuthContext)

    return(
        <>
        <header className={styles.sidebar}>
        <div className={styles.group}>
                <div className={styles.logo}>
                    <Image alt='logo atma' src={logo}/>
                </div>
                <Link href="/dashboard"><button type="button">Equipes</button></Link>
                <Link href="/atualizacoes"><button type="button">Atualizações</button></Link>
                <Link href="/novousuario"><button type="button" >Novo Usuario</button></Link>
                <Link href="/novousuariocentrocusto"><button type="button" >Novo Usuario Centro de Custo</button></Link>
        </div>
        <div className={styles.exit} onClick={signOut}><h1>Sair</h1></div>
        </header>
        </>
    )
}
