import { canSSRAuth } from "../../utils/canSSRAuth"
import styles from './styles.module.scss';
import Head from "next/head";
import Header from '../../components/Header'
import Footer from "../../components/Footer";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/router";
import { FormEvent, Key, useEffect, useState } from "react";
import { setupAPIClient } from "../../services/api";
import { toast } from "react-toastify";
import { ModalCriaUsuario } from '../../components/ModalCriaUsuario'
import Modal from 'react-modal'
import { ModalRelatorio } from "../../components/ModalRelatorio";


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
interface ListaCargo {
    cargos: cargo[]
}

export default function Inicial(
    {listaFuncionario}:ListaFuncionario,
    {cargos}: ListaCargo
    ){
    const [nivelid, setNivelId] = useState(0)
    const [funcionarios, setFuncionarios] = useState(listaFuncionario || []);
    const [listaCargos, setListaCargos] = useState(cargos || []);


    console.log(cargos)

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
            <title>Dashboard</title>
        </Head>
        <Header cargos={listaCargos} />


        <div className={styles.content}>
            <div className={styles.boxFilter}>
            <div className={styles.filter}>

                <div className={styles.filterGeneric}>
                    <h1>Operação</h1>
                    <select>
                        <option value="0">Selecione</option>
                        <option value="1">Audi</option>
                        <option value="2">BMW</option>
                    </select>
                </div>

                <div className={styles.filterGeneric}>
                    <h1>Supervisor</h1>
                    <select>
                        <option value="0">Selecione</option>
                        <option value="1">Audi</option>
                        <option value="2">BMW</option>
                    </select>
                </div>

                <div className={styles.filterGeneric}>
                    <h1>Coordenador</h1>
                    <select>
                        <option value="0">Selecione</option>
                        <option value="1">Audi</option>
                        <option value="2">BMW</option>
                    </select>
                </div>

                <div className={styles.filterGeneric}>
                    <h1>Gerente</h1>
                    <select>
                        <option value="0">Selecione</option>
                        <option value="1">Audi</option>
                        <option value="2">BMW</option>
                    </select>
                </div>

                <div className={styles.filterGeneric}>
                    <h1>Status</h1>
                    <select>
                        <option value="0">Selecione</option>
                        <option value="1">Ativo</option>
                        <option value="2">Demitido</option>
                    </select>
                </div>

            </div>
            <div className={styles.pesquisarAtualizacoes}>
                <button type="button">Pesquisar</button>
                <h1>Atualização Pendente</h1>
            </div>

            </div>
            <div className={styles.table}>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>CPF</th>
                        <th>Operação</th>
                        <th>Horario</th>
                        <th>Contrato</th>
                        <th>Carga</th>
                        <th>Supervisor</th>
                        <th>Coordenador</th>
                        <th>Gerente</th>
                    </tr>
                </thead>
                <tbody>

                        {funcionarios?.map((funcionario)=>{
                            return(
                                <tr>
                                    <td>{funcionario.nome_func}</td>
                                    <td>{funcionario.docu_func}</td>
                                    <td>{funcionario.depto_func}</td>
                                    <td>{funcionario.hent_func} ás {funcionario.hsai_func}</td>
                                    <td>{funcionario.tpcon_func == 'PADRAO1'?<>CLT</>:<>{funcionario.tpcon_func}</>}</td>
                                    <td>{funcionario.chmes_func}</td>

                                    <td>{funcionario.idsuper_func == null ? <>
                                    <select>
                                        <option value="0">Selecione</option>
                                        <option value="1">Ativo</option>
                                        <option value="2">Demitido</option>
                                    </select>
                                    </>:<>{funcionario.idsuper_func}</>}</td>

                                    <td>{funcionario.idcoor_func == null ? <>
                                    <select>
                                        <option value="0">Selecione</option>
                                        <option value="1">Ativo</option>
                                        <option value="2">Demitido</option>
                                    </select>
                                    </>:<> {funcionario.idcoor_func}</>}</td>

                                    <td>{funcionario.idger_func == null ? <>
                                    <select>
                                        <option value="0">Selecione</option>
                                        <option value="1">Ativo</option>
                                        <option value="2">Demitido</option>
                                    </select>
                                    </>:<>{funcionario.idger_func}</>}</td>

                                </tr>
                            )
                        })}

                </tbody>
            </table>
            </div>
        <Footer/>

        </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx)=>{

    const apiClient = setupAPIClient(ctx)
    
    const funcionario = await apiClient.get('/funcionario')
    const centrocusto = await apiClient.get('/centrocusto')
    const cargo = await apiClient.get('/cargo')

    console.log('funcionario: ' + funcionario)
    console.log('centrocusto: ' + centrocusto)
    console.log('cargo: ' + cargo)

    return{
        props:{
            listaFuncionario: funcionario.data[0].novo,
            cargo: cargo.data[0].novo
        }
    }
})