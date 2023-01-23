import { canSSRAuth } from "../../utils/canSSRAuth"
import styles from './styles.module.scss';
import Head from "next/head";
import Header from '../../components/Header'
import Footer from "../../components/Footer";
import { FormEvent, Key, useEffect, useState } from "react";
import { setupAPIClient } from "../../services/api";
import { toast } from "react-toastify";
import * as XLSX from 'xlsx'
import { useRouter } from "next/router";



type ReqPropsFuncionarios = {
    nome_func?: string,
    docu_func?: string,
    depto_func?: string,
    dtadm_func?: string,
    dtdem_func?: string,
    tpcon_func?: string,
    ctcust_func?: string,
    hent_func?: string,
    hsai_func?: string,
    chmes_func?: number,
    idsuper_func?: number,
    idcoor_func?: number,
    idger_func?: number,
    sis_func?: number,
    ti_func?: number,
    ctrl_func?: number,
    dtinc_func?: Date,
    dtalt_func?: Date,
    idatma_func?: number
}

interface reqFuncionarios {
    reqFuncio: ReqPropsFuncionarios
}

type ItemPropsFuncionarios = {
    [x: string]: any;
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
    usuccst: [usuccst]
}
type usuccst = {
    centrocusto: {
        idccst_ccst: number,
        nome_ccst: string,
        nivel_ccst: string
    }
}
type ItemPropsUsuarioCentroCusto = {
    idccst_usucc: number,
    idusu_usucc: number,
    idusucc_usucc: number
}
interface Listas {
    listacentrocusto: ItemPropsCentroCusto[];
    listaCargo: ItemPropsCargo[];
    listaFuncionario: ItemPropsFuncionarios[];
    listausuario: ItemPropsUsuario[];
    listausuariocentrocusto: ItemPropsUsuarioCentroCusto[]
}

export default function Dashboard(
    {listaFuncionario,listaCargo,listacentrocusto,listausuario,listausuariocentrocusto}:Listas,
    {reqFuncio}:reqFuncionarios

    ){
    const [cargoUser, setCargoUser] = useState(0)  
    const [req, setReq] = useState<ReqPropsFuncionarios>()
    const [funcionariosTable, setFuncionariosTable] = useState(listaFuncionario || []);
    const [funcionariosAtualiza, setFuncionariosAtualiza] = useState([]);
    const [funcionariosXlsx, setFuncionariosXlsx] = useState([]);
    const [cargos, setListaCargos] = useState(listaCargo || []);
    const [centroCusto, setListaCentroCusto] = useState(listacentrocusto || []);
    const [listaUsuarios, setListaUsuarios] = useState(listausuario || []);
    const [listaUsuarioCentroCusto, setListaUsuarioCentroCusto] = useState(listausuariocentrocusto || []);
    const [show, setShow] = useState(false);
    const router = useRouter()

    /* item selecionado para filtro */
    const [selectOperacao, setSelectOperacao] = useState('')
    const [selectSupervisor, setSelectSupervisor] = useState(0)
    const [selectCoordenador, setSelectCoordenador] = useState(0)
    const [selectGerente, setSelectGerente] = useState(0)
    const [selectStatus, setSelectStatus] = useState(0)

    /* item selecionado table */
    const [selectSupervisorTable, setSelectSupervisorTable] = useState('')
    const [selectCoordenadorTable, setSelectCoordenadorTable] = useState('')
    const [selectGerenteTable, setSelectGerenteTable] = useState('')
    var jsonRes = []


    function selecionaSupervisorTable(event){
        //console.log(event.target.value)
        setSelectSupervisorTable(event.target.value)
    }

    function selecionaCoordenadorTable(event){
        setSelectCoordenadorTable(event.target.value)
    }

    function selecionaGerenteTable(event){
        setSelectGerenteTable(event.target.value)
    }

    function selecionaOperacao(event){
        setSelectOperacao(event.target.value)
    }

    function selecionaStatus(event){
        setSelectStatus(event.target.value)
    }

    function selecionaSupervisor(event){
        setSelectSupervisor(event.target.value)
    }

    function selecionaCoordenador(event){
        setSelectCoordenador(event.target.value)
    }

    function selecionaGerente(event){
        setSelectGerente(event.target.value)
    }

    const setSupTable = selectSupervisorTable.split(".");
    const setCooTable = selectCoordenadorTable.split(".");
    const setGerTable = selectGerenteTable.split(".");

    let IdFuncSup = +setSupTable[0]
    let IdFuncCoo = +setCooTable[0]
    let IdFuncGer = +setGerTable[0]

    let IdUsuSup = +setSupTable[1]
    let IdUsuCoo = +setCooTable[1]
    let IdUsuGer = +setGerTable[1]

    let IdCargoUsuSup = +setSupTable[2]
    let IdCargoUsuCoo = +setCooTable[2]
    let IdCargoUsuGer = +setGerTable[2]

    let jsonAtualizaFunc = []

    if(+IdCargoUsuSup === 4){
        
        jsonAtualizaFunc = [{
            idfunc_func: +IdFuncSup,
            idsuper_func: +IdUsuSup
        }]

        handleAtualizaFuncionario()

    }

    if(+IdCargoUsuCoo === 3){
        jsonAtualizaFunc = [{
            idfunc_func: +IdFuncCoo,
            idcoor_func: +IdUsuCoo
        }]
        handleAtualizaFuncionario()

    }

    if(+IdCargoUsuGer === 2){
        jsonAtualizaFunc = [{
            idfunc_func: +IdFuncGer,
            idger_func: +IdUsuGer
        }]
        handleAtualizaFuncionario()

    }

    async function handleAtualizaFuncionario() {
        const apiClient = setupAPIClient();
        await apiClient.put('/funcionario',jsonAtualizaFunc[0]).then((res)=>{
            //toast.success('Enviado')
            //console.log(res)
            delete jsonAtualizaFunc[0]
            
        }).catch((err)=>{
            //console.log(err)
            toast.error('Não foi possivel atualizar os dados, tente novamente')
        })
    }

/* filtro tabela funcionario */

    if(+selectSupervisor == 0 && +selectCoordenador == 0 && +selectGerente == 0 && +selectOperacao == 0){
        jsonRes.push({})
    } else {
        jsonRes.push({
            idsuper_func: +selectSupervisor == 0 ? null:+selectSupervisor,
            idcoor_func: +selectCoordenador == 0 ? null : +selectCoordenador,
            idger_func: +selectGerente == 0 ? null : +selectGerente,
            ctcust_func: +selectOperacao == 0 ? null : selectOperacao
        })
    }

    async function handleFiltroFuncionario(event:FormEvent){
    
    event.preventDefault();

    jsonRes.map((item)=>{
        if(item.idsuper_func == null){
            delete item.idsuper_func
        }
        if(item.idcoor_func == null){
            delete item.idcoor_func
        }
        if(item.idger_func == null){
            delete item.idger_func
        }
        if(item.ctcust_func == null){
            delete item.ctcust_func
        }
    })

        const apiClient = setupAPIClient();
        await apiClient.post('/funcionario/filtroAll',jsonRes[0]).then((res)=>{
            if(res.data[0].status == false){
                toast.warn('Nenhum registro encontrado para este filtro')
                setShow(false)
            }
            if(res.data[0].status == true){
                //toast.success('Filtro Ok')
                setFuncionariosTable(res.data[0].novo)
                setFuncionariosXlsx(res.data[0].novo)
                setShow(true)
            }
        }).catch((err)=>{
            //console.log(err)
            toast.error('Não podemos filtrar neste momento, tente mais tarde')
        })

    }

    function handleExport(){
        var data = funcionariosXlsx
        //console.log(data)

        let separator=''
        let newDate = new Date()
        let date = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();
        let h = newDate.getHours();
        let m = newDate.getMinutes();
        let s = newDate.getSeconds();
        
        let datahora = `${date}${separator}${month<10?`0${month}`:`${month}`}${separator}${year}_${h}${separator}${m}${separator}${s}`

        ////console.log(datahora)

        var wb = XLSX.utils.book_new(),
        ws = XLSX.utils.json_to_sheet(data);

        XLSX.utils.book_append_sheet(wb, ws, "Relatorio")

        XLSX.writeFile(wb, "equipes" + datahora + ".xlsx");

        toast.success("Download concluido.")
    }

    useEffect(() => {
        if (window) { 
          // set props data to session storage or local storage  
          setCargoUser(parseInt(sessionStorage.getItem('cargo')))
        }
    }, []);
    const cargo = cargoUser;
    //console.log(cargo)

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
                        <option value="0">Selecione</option>
                        {listacentrocusto.map((cc,index)=>{
                            return(
                                <option value={cc.nivel_ccst} key={cc.idccst_ccst}>{cc.nome_ccst}</option>
                            )
                        })}
                    </select>
                </div>

                <div className={styles.filterGeneric}>
                    <h1>Supervisor</h1>
                    <select name="supervisor" onChange={selecionaSupervisor} value={selectSupervisor}>
                        <option value="0">Selecione</option>
                        {listaUsuarios.map((usu,index)=>{
                            return(usu.idcarg_usu == 4 || usu.idcarg_usu == 1 ?
                                <option value={usu.idusu_usu} key={usu.idusu_usu}>{usu.login_usu.substring(0,usu.login_usu.indexOf('@'))}</option>
                                :<></>
                            )
                        })}
                    </select>
                </div>

                <div className={styles.filterGeneric}>
                    <h1>Coordenador</h1>
                    <select name="coordenador" onChange={selecionaCoordenador} value={selectCoordenador}>
                        <option value="0">Selecione</option>
                        {listaUsuarios.map((usu,index)=>{
                            return(usu.idcarg_usu == 3  || usu.idcarg_usu == 1 ?
                                <option value={usu.idusu_usu} key={usu.idusu_usu}>{usu.login_usu.substring(0,usu.login_usu.indexOf('@'))}</option>
                                :<></>
                            )
                        })}
                    </select>
                </div>

                <div className={styles.filterGeneric}>
                    <h1>Gerente</h1>
                    <select name="gerente" onChange={selecionaGerente} value={selectGerente}>
                        <option value="0">Selecione</option>
                        {listaUsuarios.map((usu,index)=>{
                            return(usu.idcarg_usu == 2  || usu.idcarg_usu == 1 ?
                                <option value={usu.idusu_usu} key={usu.idusu_usu}>{usu.login_usu.substring(0,usu.login_usu.indexOf('@'))}</option>
                                :<></>
                            )
                        })}
                    </select>
                </div>

                <div className={styles.filterGeneric}>
                    <h1>Status</h1>
                    <select className={styles.status} onChange={selecionaStatus} value={selectStatus}>
                        <option value="3">Selecione</option>
                        <option value="1">Ativo</option>
                        <option value="2">Demitido</option>
                    </select>
                </div>

            </div>
            <div className={styles.pesquisarAtualizacoes}>
                <div className={styles.boxButton}>
                    <button type="button" onClick={handleFiltroFuncionario}>Pesquisar</button>
                    <button type="button" onClick={handleExport} className={styles.xlsx} >XLSX</button>
                </div>
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
                        {funcionariosTable?.map((funcionarios)=>{
                            return(
                                funcionarios.ctcust_func != null && show === true ?
                                
                                +selectStatus === 1 && funcionarios.dtdem_func == null ||
                                +selectStatus === 2 && funcionarios.dtdem_func != null ||
                                +selectStatus === 3 || +selectStatus == 0 ?
                                <tr key={funcionarios.idatma_func}>
                                <td>{funcionarios.nome_func}</td>
                                <td>{funcionarios.docu_func}</td>
                                <td>{funcionarios.depto_func}</td>
                                <td>{funcionarios.hent_func} ás {funcionarios.hsai_func}</td>
                                <td>{funcionarios.tpcon_func == 'PADRAO1'?<>CLT</>:<>{funcionarios.tpcon_func}</>}</td>
                                <td>{funcionarios.chmes_func/4}</td>

                                <td>{funcionarios.idsuper_func == null ? <>
                                {cargo == 1 || cargo == 2 || cargo == 3 || cargo == 4 ?
                                    <select onChange={selecionaSupervisorTable} >
                                        <option value="">Selecione</option>
                                        {listaUsuarios.map((usu,index)=>{
                                            return(usu.idcarg_usu === 4  ?
                                                usu.usuccst.map((result)=>{
                                                    return(
                                                        funcionarios.ctcust_func != null && result.centrocusto.nivel_ccst === funcionarios.ctcust_func ?
                                                        <option value={funcionarios.idfunc_func+'.'+usu.idusu_usu+'.'+4} key={usu.idusu_usu}>{usu.login_usu.substring(0,usu.login_usu.indexOf('@'))}</option>
                                                        :<></>
                                                    )
                                                })
                                                :<></>
                                            )
                                        })}
                                    </select>
                                    :<>Somente Supervisor</>}
                                </>:<>
                                        {listaUsuarios.map((usu,index)=>{
                                            return(
                                                funcionarios.idsuper_func === usu.idusu_usu ? 
                                                    +cargo == 1 || +cargo == 2 || +cargo == 3 || +cargo == 4?
                                                    <>
                                                    <div className={styles.adm}>
                                                    <div className={styles.old}>{usu.login_usu.substring(0,usu.login_usu.indexOf('@'))}</div>
                                                    <select onChange={selecionaSupervisorTable} >
                                                        <option value="">Selecione</option>
                                                        {listaUsuarios.map((usu,index)=>{
                                                            return(usu.idcarg_usu == 4  ?
                                                                usu.usuccst.map((result)=>{
                                                                    return(
                                                                        funcionarios.ctcust_func != null && result.centrocusto.nivel_ccst === funcionarios.ctcust_func ?
                                                                        <option value={funcionarios.idfunc_func+'.'+usu.idusu_usu+'.'+4} key={usu.idusu_usu}>{usu.login_usu.substring(0,usu.login_usu.indexOf('@'))}</option>
                                                                        :<></>
                                                                    )
                                                                })
                                                                :<></>
                                                            )
                                                        })}
                                                    </select>
                                                    </div>
                                                    </>:
                                                    usu.login_usu.substring(0,usu.login_usu.indexOf('@'))
                                                :<></>
                                            )
                                        })}
                                </>}</td>

                                <td>{funcionarios.idcoor_func == null ? <>
                                {cargo == 1 || cargo == 2 || cargo == 3  ?
                                    <select onChange={selecionaCoordenadorTable} >
                                        <option value="">Selecione</option>
                                        {listaUsuarios.map((usu,index)=>{
                                            return(usu.idcarg_usu == 3 && usu.usuccst ?
                                                usu.usuccst.map((result)=>{
                                                    return(
                                                        funcionarios.ctcust_func != null && result.centrocusto.nivel_ccst === funcionarios.ctcust_func ?
                                                        <option value={funcionarios.idfunc_func+'.'+usu.idusu_usu+'.'+3} key={usu.idusu_usu}>{usu.login_usu.substring(0,usu.login_usu.indexOf('@'))}</option>
                                                        :<></>
                                                    )
                                                })
                                                :<></>
                                            )
                                        })}
                                    </select>
                                    :<>Somente Coordenador ou Gerente</>}
                                </>:<> 
                                        {listaUsuarios.map((usu,index)=>{
                                            return(
                                                funcionarios.idcoor_func === usu.idusu_usu ? 
                                                +cargo == 1 || +cargo == 2 || +cargo == 3 ?
                                                <>
                                                <div className={styles.adm}>
                                                <div className={styles.old}>{usu.login_usu.substring(0,usu.login_usu.indexOf('@'))}</div>
                                                <select onChange={selecionaCoordenadorTable} >
                                                    <option value="">Selecione</option>
                                                    {listaUsuarios.map((usu,index)=>{
                                                        return(usu.idcarg_usu == 3 && usu.usuccst  || usu.idcarg_usu == 2?
                                                            usu.usuccst.map((result)=>{
                                                                return(
                                                                    funcionarios.ctcust_func != null && result.centrocusto.nivel_ccst === funcionarios.ctcust_func ?
                                                                    <option value={funcionarios.idfunc_func+'.'+usu.idusu_usu+'.'+3} key={usu.idusu_usu}>{usu.login_usu.substring(0,usu.login_usu.indexOf('@'))}</option>
                                                                    :<></>
                                                                )
                                                            })
                                                            :<></>
                                                        )
                                                    })}
                                                </select>
                                                </div>
                                                </>:
                                                usu.login_usu.substring(0,usu.login_usu.indexOf('@'))
                                                :<></>
                                            )
                                        })}
                                </>}</td>

                                <td>{funcionarios.idger_func == null ? <>
                                    {cargo == 1 || cargo == 2 ?
                                    <select onChange={selecionaGerenteTable} >
                                        <option value="">Selecione</option>
                                        {listaUsuarios.map((usu,index)=>{
                                            return(usu.idcarg_usu == 2  || usu.idcarg_usu == 1 ?
                                                usu.usuccst.map((result)=>{
                                                    return(
                                                        funcionarios.ctcust_func != null && result.centrocusto.nivel_ccst === funcionarios.ctcust_func ?
                                                        <option value={funcionarios.idfunc_func+'.'+usu.idusu_usu+'.'+2} key={usu.idusu_usu}>{usu.login_usu.substring(0,usu.login_usu.indexOf('@'))}</option>
                                                        :<></>
                                                    )
                                                })
                                                :<></>
                                            )
                                        })}
                                    </select>
                                    :<>Somente Gerente</>}
                                </>:<>
                                        {listaUsuarios.map((usu,index)=>{
                                            return(
                                                funcionarios.idger_func === usu.idusu_usu ? 
                                                +cargo == 1 || +cargo == 2 ?
                                                <>
                                                <div className={styles.adm}>
                                                <div className={styles.old}>{usu.login_usu.substring(0,usu.login_usu.indexOf('@'))}</div>
                                                <select onChange={selecionaGerenteTable} >
                                                    <option value="">Selecione</option>
                                                    {listaUsuarios.map((usu,index)=>{
                                                        return(usu.idcarg_usu == 2  || usu.idcarg_usu == 1 ?
                                                            usu.usuccst.map((result)=>{
                                                                return(
                                                                    funcionarios.ctcust_func != null && result.centrocusto.nivel_ccst === funcionarios.ctcust_func ?
                                                                    <option value={funcionarios.idfunc_func+'.'+usu.idusu_usu+'.'+2} key={usu.idusu_usu}>{usu.login_usu.substring(0,usu.login_usu.indexOf('@'))}</option>
                                                                    :<></>
                                                                )
                                                            })
                                                            :<></>
                                                        )
                                                    })}
                                                </select>
                                                </div>
                                                </>:
                                                usu.login_usu.substring(0,usu.login_usu.indexOf('@'))
                                                :<></>
                                            )
                                        })}                                
                                </>}</td>
                            </tr>:<></>:<></>
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
    
    const centrocusto = await apiClient.get('/centrocusto')
    const cargo = await apiClient.get('/cargo')
    const usuario = await apiClient.get('/usuario/listausuario')
    const usuariocentrocusto = await apiClient.get('/usuccst')


    return{
        props:{
            listaCargo: cargo.data[0].novo,
            listacentrocusto: centrocusto.data[0].novo,
            listausuario: usuario.data[0].novo,
            listausuariocentrocusto: usuariocentrocusto.data[0].novo

        }
    }
})