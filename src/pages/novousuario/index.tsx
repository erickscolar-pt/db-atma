import { canSSRAuth } from "../../utils/canSSRAuth"
import styles from './styles.module.scss';
import Head from "next/head";
import Header from '../../components/Header'
import Footer from "../../components/Footer";
import { FormEvent, Key, useEffect, useState } from "react";
import { setupAPIClient } from "../../services/api";
import Select from "react-select";


type ItemPropsFuncionarios = {
    idfunc_func: number,
    nome_func: string,
    docu_func: string,
    depto_func: string,
    dtadm_func: string,
    dtdem_func: string,
    tpcon_func: string,
    ctcust_func: string,
    hent_func: string,
    hsai_func: string,
    chmes_func: string,
    idsuper_func: number,
    idcoor_func: number,
    idger_func: number,
    sis_func: number,
    ti_func: number,
    ctrl_func: number,
    dtinc_func: Date,
    dtalt_func: Date,
    idatma_func: number
}

interface ListaFuncionario{
    listaFuncionario: ItemPropsFuncionarios[]
}

type cargo = {
    idcarg_carg: number,
    nome_carg: string
}
interface Listas {
    cargos: cargo[]
}



export default function NovoUsuario(
    {cargos}:Listas
    ){
    const [nivelid, setNivelId] = useState(0)
    const [listaCargos, setListaCargos] = useState(cargos || []);
    const [selectNivel, setSelectNivel] = useState(0)
    const [selectCargo, setSelectCargo] = useState(0)
    const [username, setUsername] = useState('')


    function nivelSelecionado(event){
        setSelectNivel(event.target.value)
    }

    function cargoSelecionado(event){
        setSelectCargo(event.target.value)
    }

    console.log(listaCargos)

    useEffect(() => {
        if (window) { 
          // set props data to session storage or local storage  
          setNivelId(parseInt(sessionStorage.getItem('nivel')))
        }
    }, []);
    
    const nivel = nivelid;

    return(
        <>
        <Head>
            <title>Novo Usuario</title>
        </Head>
        <Header/>


        <div className={styles.content}>
            <form>
                <input  type="text" 
                        name="email" 
                        placeholder='E-mail'
                        value={username}
                        onChange={(e)=>setUsername(e.target.value)}
                        />

                <select name="nivel" value={selectCargo} onChange={cargoSelecionado}>
                    <option value="">Selecione o Cargo</option>
                    {listaCargos.map((cargo, index)=>{
                        return(
                            <option value={index} key={cargo.idcarg_carg}>{cargo.nome_carg}</option>
                        )
                    })}

                </select>

                <select name="nivel" value={selectNivel} onChange={nivelSelecionado}>
                    <option value="">Selecione o Nivel</option>
                    <option value="1">Admin</option>
                    <option value="2">Operador</option>
                </select>
                <button>Registrar</button>
            </form>
        <Footer/>

        </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx)=>{

    const apiClient = setupAPIClient(ctx)
    
    const cargo = await apiClient.get('/cargo')

    return{
        props:{
            cargos: cargo.data[0].novo
        }
    }
})