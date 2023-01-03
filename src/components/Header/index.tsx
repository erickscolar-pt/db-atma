import { useContext, useState  } from 'react'
import styles from './styles.module.scss';
import btnback from '../../../public/btn-back.png'
import btnexit from '../../../public/btn-ext.png'
import logo from '../../../public/logo.png'
import Link from 'next/link';
import Image from 'next/image';
import { AuthContext } from '../../contexts/AuthContexts';
import { useRouter } from 'next/router';
import { setupAPIClient } from '../../services/api';
import { ModalCriaUsuario } from '../ModalCriaUsuario';
import Modal from 'react-modal'
import { canSSRAuth } from '../../utils/canSSRAuth';

type cargo = {
    idcarg_carg: number,
    nome_carg: string
}
interface ListaCargo {
    cargos: cargo[]
}
export default function Header({cargos}:ListaCargo){

    const router = useRouter()


    const { signOut } = useContext(AuthContext)
    const [modalUserVisible, setModalUserVisible] = useState(false)
    const [modalRelatorioVisible, setModalRelatorioVisible] = useState(false)
    const [listaCargos, setListaCargos] = useState(cargos || []);
    
    function handleCloseModalUser(){
        setModalUserVisible(false);
    }

    function handleCloseModalRelatorio(){
        setModalRelatorioVisible(false);
    }

    async function modalUser(){

        setModalUserVisible(true)
    }

    async function modalRelatorio(){

        const apiClient = setupAPIClient()

        const response = await apiClient.get('/motivo')
        setModalRelatorioVisible(true)
    }

    Modal.setAppElement('#__next');

    return(
        <>
        <header className={styles.sidebar}>
        <div className={styles.group}>
                <div className={styles.logo}>
                    <Image src={logo}/>
                </div>
                <Link href="/dashboard"><button type="button">Equipes</button></Link>
                <Link href="/atualizacoes"><button type="button">Atualizações</button></Link>
                <button type="button" onClick={modalUser}>Criar Usuario</button>
                <button type="button" disabled={true}>Relatorio</button>
        </div>
        <div className={styles.exit} onClick={signOut}><h1>Sair</h1></div>
        </header>
        { modalUserVisible && (
            <ModalCriaUsuario
                    isOpen={modalUserVisible}
                    onRequestClose={handleCloseModalUser} 
                    itemCargo={listaCargos}/>
        )}
        </>
    )
}
