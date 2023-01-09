import { canSSRAuth } from "../../utils/canSSRAuth"
import styles from './styles.module.scss';
import Head from "next/head";
import Header from '../../components/Header'
import Footer from "../../components/Footer";
import { FormEvent, Key, useEffect, useState } from "react";
import { setupAPIClient } from "../../services/api";
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
    chmes_func: number,
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

type ItemPropsCargo = {
    idcarg_carg: number,
    nome_carg: string
}


type ItemPropsCentroCusto = {
    idccst_ccst: number,
    nome_ccst: string,
    nivel_ccst: string
}
type ItemPropsUsuario = {
    idusu_usu: number,
    nivel_usu: number,
    idcarg_usu: number,
    login_usu: string
}
interface Listas {
    listacentrocusto: ItemPropsCentroCusto[];
    listaCargo: ItemPropsCargo[];
    listaFuncionario: ItemPropsFuncionarios[];
    listausuario: ItemPropsUsuario[]
}

export default function Dashboard(
    {listaFuncionario,listaCargo,listacentrocusto,listausuario}:Listas,
    ){
    const [nivelid, setNivelId] = useState(0)
    const [funcionarios, setFuncionarios] = useState(listaFuncionario || []);
    const [cargos, setListaCargos] = useState(listaCargo || []);
    const [centroCusto, setListaCentroCusto] = useState(listacentrocusto || []);
    const [listaUsuarios, setListaUsuarios] = useState(listausuario || []);
    /* item selecionado para filtro */
    const [selectOperacao, setSelectOperacao] = useState('')
    const [selectSupervisor, setSelectSupervisor] = useState(0)
    const [selectCoordenador, setSelectCoordenador] = useState(0)
    const [selectGerente, setSelectGerente] = useState(0)
    const [selectStatus, setSelectStatus] = useState(0)


    function selecionaOperacao(event){
        console.log(event.target.value)
        setSelectOperacao(event.target.value)
    }

    function selecionaStatus(event){
        setSelectStatus(event.target.value)
    }

/* 
      {
        "idcarg_carg": 1,
        "nome_carg": "Diretor"
      },
      {
        "idcarg_carg": 2,
        "nome_carg": "Gerente"
      },
      {
        "idcarg_carg": 3,
        "nome_carg": "Coordenador"
      },
      {
        "idcarg_carg": 4,
        "nome_carg": "Supervisor"
      }
*/

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
        <Header/>


        <div className={styles.content}>
            <div className={styles.boxFilter}>
            <div className={styles.filter}>

                <div className={styles.filterGeneric}>
                    <h1>Operação</h1>
                    <select name="operacao" onChange={selecionaOperacao} value={selectOperacao}>
                        <option value="zero">Selecione</option>
                        {listacentrocusto.map((cc,index)=>{
                            return(
                                <option value={cc.nivel_ccst} key={cc.idccst_ccst}>{cc.nome_ccst + ' ' + cc.nivel_ccst}</option>
                            )
                        })}
                    </select>
                </div>

                <div className={styles.filterGeneric}>
                    <h1>Supervisor</h1>
                    <select>
                        <option value="">Selecione</option>
                        {listaUsuarios.map((usu,index)=>{
                            return(usu.idcarg_usu == 4 ?
                                <option value={index} key={usu.idusu_usu}>{usu.login_usu.substring(0,usu.login_usu.indexOf('.'))}</option>
                                :<></>
                            )
                        })}
                    </select>
                </div>

                <div className={styles.filterGeneric}>
                    <h1>Coordenador</h1>
                    <select>
                        <option value="">Selecione</option>
                        {listaUsuarios.map((usu,index)=>{
                            return(usu.idcarg_usu == 3 ?
                                <option value={index} key={usu.idusu_usu}>{usu.login_usu.substring(0,usu.login_usu.indexOf('.'))}</option>
                                :<></>
                            )
                        })}
                    </select>
                </div>

                <div className={styles.filterGeneric}>
                    <h1>Gerente</h1>
                    <select>
                        <option value="">Selecione</option>
                        {listaUsuarios.map((usu,index)=>{
                            return(usu.idcarg_usu == 2 ?
                                <option value={index} key={usu.idusu_usu}>{usu.login_usu.substring(0,usu.login_usu.indexOf('.'))}</option>
                                :<></>
                            )
                        })}
                    </select>
                </div>

                <div className={styles.filterGeneric}>
                    <h1>Status</h1>
                    <select onChange={selecionaStatus} value={selectStatus}>
                        <option value="3">Selecione</option>
                        <option value="1" selected>Ativo</option>
                        <option value="2">Demitido</option>
                    </select>
                </div>

            </div>
{/*             <div className={styles.pesquisarAtualizacoes}>
                <button type="button">Pesquisar</button>
                <h1>Atualização Pendente</h1>
            </div> */}
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
                                selectStatus === 1 && funcionario.dtdem_func === null &&
                                selectOperacao !== "zero" && selectOperacao === funcionario.ctcust_func ||
                                selectOperacao === "zero" ||
                                selectStatus === 2 && funcionario.dtdem_func !== null &&
                                selectOperacao !== "zero" && selectOperacao === funcionario.ctcust_func ||
                                selectOperacao === "zero" ||
                                selectStatus === 3 && funcionario.dtdem_func === null || funcionario.dtdem_func !== null ||
                                selectOperacao === "zero"?
                                
                                <tr key={funcionario.idatma_func}>
                                <td>{funcionario.nome_func}</td>
                                <td>{funcionario.docu_func}</td>
                                <td>{funcionario.depto_func}</td>
                                <td>{funcionario.hent_func} ás {funcionario.hsai_func}</td>
                                <td>{funcionario.tpcon_func == 'PADRAO1'?<>CLT</>:<>{funcionario.tpcon_func}</>}</td>
                                <td>{funcionario.chmes_func/4}</td>

                                <td>{funcionario.idsuper_func == null ? <>
                                    <select>
                                        <option value="">Selecione</option>
                                        {listaUsuarios.map((usu,index)=>{
                                            return(usu.idcarg_usu === 4 ?
                                                <option value={index} key={usu.idusu_usu}>{usu.login_usu.substring(0,usu.login_usu.indexOf('.'))}</option>
                                                :<></>
                                            )
                                        })}
                                    </select>
                                </>:<>
                                        {listaUsuarios.map((usu,index)=>{
                                            return(
                                                usu.idusu_usu === funcionario.idsuper_func ? 
                                                usu.login_usu.substring(0,usu.login_usu.indexOf('.')):
                                                <></>
                                            )
                                        })}
                                </>}</td>

                                <td>{funcionario.idcoor_func == null ? <>
                                    <select>
                                        <option value="">Selecione</option>
                                        {listaUsuarios.map((usu,index)=>{
                                            return(usu.idcarg_usu == 3 ?
                                                <option value={index} key={usu.idusu_usu}>{usu.login_usu.substring(0,usu.login_usu.indexOf('.'))}</option>
                                                :<></>
                                            )
                                        })}
                                    </select>
                                </>:<> 
                                        {listaUsuarios.map((usu,index)=>{
                                            return(
                                                usu.idusu_usu === funcionario.idsuper_func ? 
                                                usu.login_usu.substring(0,usu.login_usu.indexOf('.')):
                                                <></>
                                            )
                                        })}
                                </>}</td>

                                <td>{funcionario.idger_func == null ? <>
                                    <select>
                                        <option value="">Selecione</option>
                                        {listaUsuarios.map((usu,index)=>{
                                            return(usu.idcarg_usu == 2 ?
                                                <option value={index} key={usu.idusu_usu}>{usu.login_usu.substring(0,usu.login_usu.indexOf('.'))}</option>
                                                :<></>
                                            )
                                        })}
                                    </select>
                                </>:<>
                                        {listaUsuarios.map((usu,index)=>{
                                            return(
                                                usu.idusu_usu === funcionario.idsuper_func ? 
                                                usu.login_usu.substring(0,usu.login_usu.indexOf('.')):
                                                <></>
                                            )
                                        })}                                
                                </>}</td>
                            </tr>
                            :<>
                            </>
                            
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
    const usuario = await apiClient.get('/usuario/listausuario')

    return{
        props:{
            listaFuncionario: funcionario.data[0].novo,
            listaCargo: cargo.data[0].novo,
            listacentrocusto: centrocusto.data[0].novo,
            listausuario: usuario.data[0].novo
        }
    }
})