import { canSSRAuth } from "../../utils/canSSRAuth"
import styles from './styles.module.scss';
import Head from "next/head";
import Header from '../../components/Header'
import { MdDoneAll } from "react-icons/md";
import { setupAPIClient } from "../../services/api";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import InputMask from 'react-input-mask'
import Router,{ useRouter } from 'next/router'


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
export default function Atualizacoes({listaFuncionario}:ListaFuncionario){

    const [funcionarios, setFuncionarios] = useState(listaFuncionario || [])

    /* deminido */
    const [checkSistemaDemitido, setCheckSistemaDemitido] = useState(0)
    const [checkTrueOrFalseSistemaDemitido, setCheckTrueOrFalseSistemaDemitido] = useState()
    const [checkTiDemitido, setCheckTiDemitido] = useState(0)
    const [checkTrueOrFalseTiDemitido, setCheckTrueOrFalseTiDemitido] = useState()
    const [checkControlDemitido, setCheckControlDemitido] = useState(0)
    const [checkTrueOrFalseControlDemitido, setCheckTrueOrFalseControlDemitido] = useState()


    /* funcionalidades demitido */
    function selectSistemaDemitido(event){
        setCheckSistemaDemitido(event.target.value)
        setCheckTrueOrFalseSistemaDemitido(event.target.checked)
    }
    
    if(checkTrueOrFalseSistemaDemitido == true){
        handleRegistro(checkSistemaDemitido,1,'sistema')
    }
    
    function selectTiDemitido(event){
        setCheckTiDemitido(event.target.value)
        setCheckTrueOrFalseTiDemitido(event.target.checked)
    }
    if(checkTrueOrFalseTiDemitido == true){
        handleRegistro(checkTiDemitido,1,'ti')
    }
    
    function selectControlDemitido(event){
        setCheckControlDemitido(event.target.value)
        setCheckTrueOrFalseControlDemitido(event.target.checked)
    }
    
    if(checkTrueOrFalseControlDemitido == true){
        handleRegistro(checkControlDemitido,1,'control')
    }
    /* fim funcionalidades demitido */
    
    /* registro */
    async function handleRegistro(idfunc_func,sis_func,area){

        const apiClient = setupAPIClient();
        const JSON_REGRA = []

        if(area === 'sistema'){
            JSON_REGRA.push({
                idfunc_func: parseInt(idfunc_func),
                sis_func: sis_func
            })
        }

        if(area === 'ti'){
            JSON_REGRA.push({
                idfunc_func: parseInt(idfunc_func),
                ti_func: sis_func
            })
        }

        if(area === 'control'){
            JSON_REGRA.push({
                idfunc_func: parseInt(idfunc_func),
                ctrl_func: sis_func
            })
        }

        console.log(JSON_REGRA[0])
        await apiClient.put('/funcionario',JSON_REGRA[0]).then(()=>{
            Router.reload()
            toast.success('Check!')
        }).catch((err)=>{
            console.log(err)
            toast.error('erro ao gravar')
        })
    }

    return(
        <>
        <Head>
            <title>Atualizações</title>
        </Head>
        <Header/>
        <div className={styles.content}>

        <div className={styles.table}>
            <h1>Demitido</h1>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>CPF</th>
                        <th>Operação</th>
                        <th>Horario</th>
                        <th>Contrato</th>
                        <th>Carga</th>
                        <th>Sistemas</th>
                        <th>T.I</th>
                        <th>Control</th>
                    </tr>
                </thead>
                <tbody>
                {funcionarios?.map((funcionario)=>{
                    return(
                        <tr key={funcionario.idatma_func}>
                        {funcionario.dtdem_func == null || 
                         funcionario.sis_func === 1 &&
                         funcionario.ti_func === 1 &&
                         funcionario.ctrl_func === 1 ? 
                            <></> : 
                            <>
                            <td>{funcionario.nome_func}</td>
                            <td>{funcionario.docu_func}</td>
                            <td>{funcionario.depto_func}</td>
                            <td>{funcionario.hent_func} ás {funcionario.hsai_func}</td>
                            <td>{funcionario.tpcon_func == 'PADRAO1'?<>CLT</>:<>{funcionario.tpcon_func}</>}</td>
                            <td>{funcionario.chmes_func}</td>
                            <td>
                                {
                                    funcionario.sis_func === 1 ? 
                                    <MdDoneAll size={20}/> :
                                    <input type="checkbox" onChange={selectSistemaDemitido} value={funcionario.idfunc_func}/>
                                }
                            </td>
                            <td>
                                {
                                    funcionario.ti_func === 1 ? 
                                    <MdDoneAll size={20}/> :
                                    <input type="checkbox" onChange={selectTiDemitido} value={funcionario.idfunc_func}/>
                                }
                            </td>
                            <td>
                                {
                                    funcionario.ctrl_func === 1 ? 
                                    <MdDoneAll size={20}/> :
                                    <input type="checkbox" onChange={selectControlDemitido} value={funcionario.idfunc_func}/>
                                }
                            </td>
                            </>
                        }

                        </tr>
                            )
                })}
                </tbody>
            </table>
        </div>

        <div className={styles.table}>
            <h1>Ativo</h1>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>CPF</th>
                        <th>Operação</th>
                        <th>Horario</th>
                        <th>Contrato</th>
                        <th>Carga</th>
                        <th>Sistemas</th>
                        <th>T.I</th>
                        <th>Control</th>
                    </tr>
                </thead>
                <tbody>
                {funcionarios?.map((funcionario)=>{
                    return(
                        <tr key={funcionario.idatma_func}>
                        {funcionario.dtdem_func != null ? 
                            <></> : 
                            <>
                            <td>{funcionario.nome_func}</td>
                            <td>{funcionario.docu_func}</td>
                            <td>{funcionario.depto_func}</td>
                            <td>{funcionario.hent_func} ás {funcionario.hsai_func}</td>
                            <td>{funcionario.tpcon_func == 'PADRAO1'?<>CLT</>:<>{funcionario.tpcon_func}</>}</td>
                            <td>{funcionario.chmes_func}</td>
                            <td><input type="checkbox" value="1"/></td>
                            <td><input type="checkbox" value="1"/></td>
                            <td><input type="checkbox" value="1"/></td>
                            </>
                        }

                        </tr>
                            )
                })}
                </tbody>
            </table>
        </div>
        </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx)=>{

    const apiClient = setupAPIClient(ctx)
    
    const funcionario = await apiClient.get('/funcionario')
    const centrocusto = await apiClient.get('/centrocusto')
    const cargo = await apiClient.get('/cargo')
    
        return{
            props:{
                listaFuncionario: funcionario.data[0].novo
            }
        }
    

})