import { canSSRAuth } from "../../utils/canSSRAuth"
import styles from './styles.module.scss';
import Head from "next/head";
import Header from '../../components/Header'
import Footer from "../../components/Footer";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/router";
import { setupAPIClient } from "../../services/api";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import InputMask from 'react-input-mask'

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
export default function VencidoAtendimento({listaFuncionario}:ListaFuncionario){

    const [idUser, setIdUser] = useState(0)  
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const [plano, setPlano] = useState(0);
    const [dataVencimento, setDataVencimento] = useState('');
    const [valorEntrada, setValorEntrada] = useState('');
    const [valorDemais, setValorDemais] = useState('');
    const [tabulacao, setTabulacao] = useState('');
    const [origemAtendimento, setOrigemAtendimento] = useState('');
    const [idMotivo, setIdMotivo] = useState('');
    const [idUsuario, setIdUsuario] = useState('');
    const [saldoRisco, setSaldoRisco] = useState('');
    const router = useRouter()
    const param = router.asPath
    const [funcionarios, setFuncionarios] = useState(listaFuncionario || [])
    const [motivoSelect, setMotivoSelect] = useState<any>()

    var btnactive:boolean = false

    const mask = (v: string) => {
        v = v.replace(/\D/g, "")
        
        if (v.length <= 11) {
        v = v.replace(/(\d{3})(\d)/, "$1.$2")
        v = v.replace(/(\d{3})(\d)/, "$1.$2")
        v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
        } else {
        v = v.substring(0, 14); // limita em 14 números
        v = v.replace(/^(\d{2})(\d)/, "$1.$2")
        v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        v = v.replace(/\.(\d{3})(\d)/, ".$1/$2")
        v = v.replace(/(\d{4})(\d)/, "$1-$2")
        }
        
        return v
        }

    useEffect(() => {
        if (window) { 
          // set props data to session storage or local storage  
          setIdUser(parseInt(sessionStorage.getItem('id')))
        }
    }, []);
    const id = idUser

    if(param == '/vencidonegociacao'){
        btnactive = true;
    }

    function selectMotivo(event){

        ////console.log("posição", event.target.value)
        ////console.log("selecionado", listMotivo[event.target.value])

        setMotivoSelect(event.target.value)

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
                        {funcionario.dtdem_func == null ? 
                            <></> : 
                            <>
                            <td>{funcionario.nome_func}</td>
                            <td>{funcionario.docu_func}</td>
                            <td>{funcionario.depto_func}</td>
                            <td>{funcionario.hent_func} ás {funcionario.hsai_func}</td>
                            <td>{funcionario.tpcon_func == 'PADRAO1'?<>CLT</>:<>{funcionario.tpcon_func}</>}</td>
                            <td>{funcionario.chmes_func}</td>
                            <td><label className={styles.container}><input type="checkbox"/><span></span></label></td>
                            <td><input type="checkbox"/></td>
                            <td><input type="checkbox"/></td>
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
                            <td><input type="checkbox"/></td>
                            <td><input type="checkbox"/></td>
                            <td><input type="checkbox"/></td>
                            </>
                        }

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
    
        return{
            props:{
                listaFuncionario: funcionario.data[0].novo
            }
        }
    

})