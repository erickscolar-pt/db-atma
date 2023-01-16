import { canSSRAuth } from "../../utils/canSSRAuth"
import styles from './styles.module.scss';
import Head from "next/head";
import Header from '../../components/Header'
import { MdDoneAll } from "react-icons/md";
import { setupAPIClient } from "../../services/api";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import InputMask from 'react-input-mask'
import Router, { useRouter } from 'next/router'


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

interface ListaFuncionario {
    listaFuncionario: ItemPropsFuncionarios[]
}
export default function Atualizacoes({ listaFuncionario }: ListaFuncionario) {

    const [funcionarios, setFuncionarios] = useState(listaFuncionario || [])
    const [cargoUser, setCargoUser] = useState(0)
    const router = useRouter()
    /* deminido */
    const [checkSistema, setCheckSistema] = useState(0)
    const [checkTrueOrFalseSistema, setCheckTrueOrFalseSistema] = useState()
    const [checkTi, setCheckTi] = useState(0)
    const [checkTrueOrFalseTi, setCheckTrueOrFalseTi] = useState()
    const [checkControl, setCheckControl] = useState(0)
    const [checkTrueOrFalseControl, setCheckTrueOrFalseControl] = useState()
    const [selectStatus, setSelectStatus] = useState(0)


    /* funcionalidades demitido e ativo */
    function selecionaStatus(event) {
        setSelectStatus(event.target.value)
    }

    function selectSistema(event) {
        setCheckSistema(event.target.value)
        setCheckTrueOrFalseSistema(event.target.checked)
    }

    if (checkTrueOrFalseSistema === true) {
        handleRegistro(checkSistema, 0, 'sistema')
    } else if (checkTrueOrFalseSistema == false) {
        handleRegistro(checkSistema, 1, 'sistema')
    }

    function selectTi(event) {
        setCheckTi(event.target.value)
        setCheckTrueOrFalseTi(event.target.checked)
    }

    if (checkTrueOrFalseTi === true) {
        handleRegistro(checkTi, 0, 'ti')
    } else if (checkTrueOrFalseTi == false) {
        handleRegistro(checkTi, 1, 'ti')
    }

    function selectControl(event) {
        setCheckControl(event.target.value)
        setCheckTrueOrFalseControl(event.target.checked)
    }

    if (checkTrueOrFalseControl === true) {
        handleRegistro(checkControl, 0, 'control')
    } else if (checkTrueOrFalseControl == false) {
        handleRegistro(checkControl, 1, 'control')
    }

    /* fim funcionalidades demitido */

    /* registro */
    async function handleRegistro(idfunc_func, sis_func, area) {

        const apiClient = setupAPIClient();
        const JSON_REGRA = []

        if (area === 'sistema') {
            JSON_REGRA.push({
                idfunc_func: parseInt(idfunc_func),
                sis_func: sis_func
            })
        }

        if (area === 'ti') {
            JSON_REGRA.push({
                idfunc_func: parseInt(idfunc_func),
                ti_func: sis_func
            })
        }

        if (area === 'control') {
            JSON_REGRA.push({
                idfunc_func: parseInt(idfunc_func),
                ctrl_func: sis_func
            })
        }

        //console.log(JSON_REGRA[0])
        await apiClient.put('/funcionario', JSON_REGRA[0]).then((res) => {
            //console.log(res)
        }).catch((err) => {
            console.log(err)
            toast.error('erro ao gravar')
        })
    }

    useEffect(() => {
        if (window) {
            // set props data to session storage or local storage  
            setCargoUser(parseInt(sessionStorage.getItem('cargo')))
        }
    }, []);


    const cargo = cargoUser;
    var disableSis = true;
    var disableTi = true;
    var disableControl = true;


    if (isNaN(cargo)) {
        if (process.browser) {
            console.log('refresh')
            router.reload();
        }
    }
    if (cargoUser === 103 || cargoUser === 1 || cargoUser === 2) {
        console.log(cargo)
        disableSis = false
    }

    if (cargoUser === 104 || cargoUser === 1 || cargoUser === 2) {
        console.log(cargo)
        disableTi = false
    }

    if (cargoUser === 105 || cargoUser === 1 || cargoUser === 2) {
        console.log(cargo)
        disableControl = false
    }

    console.log(disableSis)


    return (
        <>
            <Head>
                <title>Atualizações</title>
            </Head>
            <Header />
            <div className={styles.content}>
                <div className={styles.boxFilter}>
                    <div className={styles.filter}>
                        <div className={styles.filterGeneric}>
                            <h1>Status</h1>
                            <select className={styles.status} onChange={selecionaStatus} value={selectStatus}>
                                <option value="3">Selecione</option>
                                <option value="1">Ativo</option>
                                <option value="2">Demitido</option>
                            </select>
                        </div>
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
                                <th>Sistemas</th>
                                <th>T.I</th>
                                <th>Control</th>
                            </tr>
                        </thead>
                        <tbody>
                            {funcionarios?.map((funcionarios) => {
                                return (
                                    funcionarios.ctcust_func != null ?
                                        +selectStatus === 1 && funcionarios.dtdem_func === null ?
                                            funcionarios.sis_func.toString().concat(funcionarios.ti_func.toString(), funcionarios.ctrl_func.toString()) === '111' ?
                                                <tr key={funcionarios.idatma_func}>
                                                    <td>{funcionarios.nome_func}</td>
                                                    <td>{funcionarios.docu_func} </td>
                                                    <td>{funcionarios.depto_func}</td>
                                                    <td>{funcionarios.hent_func} ás {funcionarios.hsai_func}</td>
                                                    <td>{funcionarios.tpcon_func == 'PADRAO1' ? <>CLT</> : <>{funcionarios.tpcon_func}</>}</td>
                                                    <td>{funcionarios.chmes_func / 4}</td>
                                                    <td>
                                                        {
                                                            funcionarios.sis_func === 0 ?
                                                                cargoUser === 1 || cargoUser === 2 ?
                                                                    <input disabled={disableSis} defaultChecked={funcionarios.sis_func === 0} type="checkbox" onChange={selectSistema} value={funcionarios.idfunc_func} />
                                                                    : funcionarios.dtdem_func !== null ?
                                                                        <input defaultChecked={funcionarios.ctrl_func === 0} disabled={disableSis} type="checkbox" onChange={selectSistema} value={funcionarios.idfunc_func} />
                                                                        : <MdDoneAll size={20} />
                                                                : <input defaultChecked={funcionarios.ctrl_func === 0} disabled={disableSis} type="checkbox" onChange={selectSistema} value={funcionarios.idfunc_func} />

                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            funcionarios.ti_func === 0 ?
                                                                cargoUser === 1 || cargoUser === 2 ?
                                                                    <input disabled={disableTi} defaultChecked={funcionarios.ti_func === 0} type="checkbox" onChange={selectTi} value={funcionarios.idfunc_func} />
                                                                    : funcionarios.dtdem_func != null ?
                                                                        <input defaultChecked={funcionarios.ctrl_func === 0} disabled={disableTi} type="checkbox" onChange={selectTi} value={funcionarios.idfunc_func} />
                                                                        : <MdDoneAll size={20} />
                                                                : <input defaultChecked={funcionarios.ctrl_func === 0} disabled={disableTi} type="checkbox" onChange={selectTi} value={funcionarios.idfunc_func} />

                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            funcionarios.ctrl_func === 0 ?
                                                                cargoUser === 1 || cargoUser === 2 ?
                                                                    <input disabled={disableControl} defaultChecked={funcionarios.ctrl_func === 0} type="checkbox" onChange={selectControl} value={funcionarios.idfunc_func} />
                                                                    : funcionarios.dtdem_func != null ?
                                                                        <input defaultChecked={funcionarios.ctrl_func === 0} disabled={disableControl} type="checkbox" onChange={selectControl} value={funcionarios.idfunc_func} />
                                                                        : <MdDoneAll size={20} />
                                                                : <input defaultChecked={funcionarios.ctrl_func === 0} disabled={disableControl} type="checkbox" onChange={selectControl} value={funcionarios.idfunc_func} />

                                                        }
                                                    </td>
                                                </tr> : <></> : <></>
                                        : <>
                                            {
                                                +selectStatus === 2 && funcionarios.dtdem_func !== null ?
                                                    <>
                                                        {
                                                            funcionarios.sis_func.toString().concat(funcionarios.ti_func.toString(), funcionarios.ctrl_func.toString()) === '000' ?
                                                                <>
                                                                    <tr key={funcionarios.idatma_func}>
                                                                        <td>{funcionarios.nome_func}</td>
                                                                        <td>{funcionarios.docu_func} </td>
                                                                        <td>{funcionarios.depto_func}</td>
                                                                        <td>{funcionarios.hent_func} ás {funcionarios.hsai_func}</td>
                                                                        <td>{funcionarios.tpcon_func == 'PADRAO1' ? <>CLT</> : <>{funcionarios.tpcon_func}</>}</td>
                                                                        <td>{funcionarios.chmes_func / 4}</td>
                                                                        <td>
                                                                            {
                                                                                funcionarios.sis_func === 0 ?
                                                                                    cargoUser === 1 || cargoUser === 2 ?
                                                                                        <input disabled={disableSis} defaultChecked={funcionarios.sis_func === 0} type="checkbox" onChange={selectSistema} value={funcionarios.idfunc_func} />
                                                                                        : funcionarios.dtdem_func !== null ?
                                                                                            <input defaultChecked={funcionarios.ctrl_func === 0} disabled={disableSis} type="checkbox" onChange={selectSistema} value={funcionarios.idfunc_func} />
                                                                                            : <MdDoneAll size={20} />
                                                                                    : <input defaultChecked={funcionarios.ctrl_func === 0} disabled={disableSis} type="checkbox" onChange={selectSistema} value={funcionarios.idfunc_func} />

                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                funcionarios.ti_func === 0 ?
                                                                                    cargoUser === 1 || cargoUser === 2 ?
                                                                                        <input disabled={disableTi} defaultChecked={funcionarios.ti_func === 0} type="checkbox" onChange={selectTi} value={funcionarios.idfunc_func} />
                                                                                        : funcionarios.dtdem_func != null ?
                                                                                            <input defaultChecked={funcionarios.ctrl_func === 0} disabled={disableTi} type="checkbox" onChange={selectTi} value={funcionarios.idfunc_func} />
                                                                                            : <MdDoneAll size={20} />
                                                                                    : <input defaultChecked={funcionarios.ctrl_func === 0} disabled={disableTi} type="checkbox" onChange={selectTi} value={funcionarios.idfunc_func} />

                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                funcionarios.ctrl_func === 0 ?
                                                                                    cargoUser === 1 || cargoUser === 2 ?
                                                                                        <input disabled={disableControl} defaultChecked={funcionarios.ctrl_func === 0} type="checkbox" onChange={selectControl} value={funcionarios.idfunc_func} />
                                                                                        : funcionarios.dtdem_func != null ?
                                                                                            <input defaultChecked={funcionarios.ctrl_func === 0} disabled={disableControl} type="checkbox" onChange={selectControl} value={funcionarios.idfunc_func} />
                                                                                            : <MdDoneAll size={20} />
                                                                                    : <input defaultChecked={funcionarios.ctrl_func === 0} disabled={disableControl} type="checkbox" onChange={selectControl} value={funcionarios.idfunc_func} />

                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                </>
                                                                : <></>
                                                        }
                                                    </> : <>

                                                    </>
                                            }
                                        </>)
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    const apiClient = setupAPIClient(ctx)

    const funcionario = await apiClient.get('/funcionario')
    const centrocusto = await apiClient.get('/centrocusto')
    const cargo = await apiClient.get('/cargo')

    return {
        props: {
            listaFuncionario: funcionario.data[0].novo
        }
    }


})