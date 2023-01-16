import { canSSRAuth } from "../../utils/canSSRAuth"
import styles from './styles.module.scss';
import Head from "next/head";
import Header from '../../components/Header'
import Footer from "../../components/Footer";
import { FormEvent, Key, useEffect, useState } from "react";
import { setupAPIClient } from "../../services/api";
import Select from "react-select";
import { toast } from "react-toastify";


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

    async function handleRegistroUsuario(event:FormEvent){

        event.preventDefault();

        console.log(username)
        console.log(selectCargo)
        console.log(selectNivel)
        const password = ''


        if(username === '' || selectNivel === 3 || selectCargo === 9){
            toast.warn('Preencha todos os campos')
            return;
        }

            const apiClient = setupAPIClient();
            await apiClient.post('/auth/signup',{
                nome:username,
                senha:password,
                nivel: +selectNivel,
                cargo: +selectCargo
            }).then(()=>{
                toast.success('gravado com sucesso')
            }).catch((err)=>{
                console.log(err)
                toast.error('erro ao gravar')
            })
        


    }

    return(
        <>
        <Head>
            <title>Novo Usuario</title>
        </Head>
        <Header/>


        <div className={styles.content}>
            <form action="" onSubmit={handleRegistroUsuario}>
                <input  type="text" 
                        name="email" 
                        placeholder='E-mail'
                        value={username}
                        onChange={(e)=>setUsername(e.target.value)}
                        />

                <select name="nivel" value={selectCargo} onChange={cargoSelecionado}>
                    <option value="9">Selecione o Cargo</option>
                    {listaCargos.map((cargo, index)=>{
                        return(
                            <option value={cargo.idcarg_carg} key={cargo.idcarg_carg}>{cargo.nome_carg}</option>
                        )
                    })}

                </select>

                <select name="nivel" value={selectNivel} onChange={nivelSelecionado}>
                    <option value="3">Selecione o Nivel</option>
                    <option value="1">Admin</option>
                    <option value="2">Usuario</option>
                </select>
                <button type='submit'>Registrar</button>
            </form>

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