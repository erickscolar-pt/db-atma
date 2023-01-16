import { canSSRAuth } from "../../utils/canSSRAuth"
import styles from './styles.module.scss';
import Head from "next/head";
import Header from '../../components/Header'
import Footer from "../../components/Footer";
import { FormEvent, Key, useEffect, useState } from "react";
import { setupAPIClient } from "../../services/api";
import Select from "react-select";
import {MdAdd, MdRemove} from 'react-icons/md';
import { toast } from "react-toastify";
import Router,{ useRouter } from 'next/router'

type ItemPropsUsuarioCentroCusto = {
    idccst_usucc: number,
    idusu_usucc: number,
    idusucc_usucc: number
}
type ItemPropsCentroCusto = {
    idccst_ccst: number,
    nome_ccst: string,
    nivel_ccst: string,
}

type ItemPropsUsuario = {
    idusu_usu: number,
    nivel_usu: number,
    idcarg_usu: number,
    login_usu: string
    usuccst: usuccst[];
}
type usuccst = {
    centrocusto: {
        idccst_ccst: number,
        nome_ccst: string,
        nivel_ccst: string
    }
}
type cargo = {
    idcarg_carg: number,
    nome_carg: string
}
interface Listas {
    listausuario: ItemPropsUsuario[]
    listausuariocentrocusto: ItemPropsUsuarioCentroCusto[]
    cargos: cargo[]
}

export default function AlterarUsuario(
    {listausuario, listausuariocentrocusto,cargos}:Listas,
    JsonCC
    ){
    const [listaUsuarios, setListaUsuarios] = useState(listausuario || []);
    const [listaUsuarioCentroCusto, setListaUsuarioCentroCusto] = useState(listausuariocentrocusto || []);
    const [selectUsuario, setSelectUsuario] = useState([]);
    const [selectCentroCusto, setSelectCentroCusto] = useState([]);
    const [desibleId, setDesibleId] = useState([0])
    const [listaCargos, setListaCargos] = useState(cargos || []);
    const [selectNivel, setSelectNivel] = useState(0)
    const [selectCargo, setSelectCargo] = useState(0)
    const [idUsuario, setIdUsuario] = useState(0)
    
    function nivelSelecionado(event){
        setSelectNivel(event.target.value)
    }

    function cargoSelecionado(event){
        setSelectCargo(event.target.value)
    }


    
    /* usuario */
      const result = listaUsuarioCentroCusto.filter(lista=>lista.idusu_usucc == selectUsuario['value'])
      const optionsUsuario = [];

      listaUsuarios.map((lista)=>{
        optionsUsuario.push({
            value: lista.idusu_usu, label: lista.login_usu, cargo: lista.idcarg_usu, nivel: lista.nivel_usu
        })
      })

      const handleUsuarioChange =  async (selected, selectaction) => {
        const { action } = selectaction;

        console.log()
        if(selected.cargo > 0){
            setSelectCargo(selected.cargo)
        }

        if(selected.nivel > 0){
            setSelectNivel(selected.nivel)
        }
        setIdUsuario(selected.value)

        setSelectUsuario(selected);
      }
      /* fim usuario */

    /* registro usu centro custo */

    async function handleRegistroUsuCentroCusto(event: FormEvent){
        event.preventDefault();

        const apiClient = setupAPIClient();

        console.log('idusu_usu ' + idUsuario)
        console.log('nivel_usu ' + selectNivel)
        console.log('idcarg_usu ' + selectCargo)

        await apiClient.put('/usuario',{
            idusu_usu: +idUsuario,
            nivel_usu: +selectNivel,
            idcarg_usu: +selectCargo
        }).then(()=>{
            toast.success('Usuario alterado')
        }).catch((err)=>{
            console.log(err)
            toast.error('erro ao gravar')
        })
    }
    /* fim registro usu centro custo */

    return(
        <>
        <Head>
            <title>Alterar Usuario</title>
        </Head>
        <Header/>


        <div className={styles.content}>
            <form onSubmit={handleRegistroUsuCentroCusto}>
            <div className={styles.usuario}>
                <h1>Lista de Usuario</h1>
                <Select
                        className={styles.select}
                        id="selectUsuario"
                        instanceId="selectUsuario"
                        name="usuario"
                        classNamePrefix="select"
                        options={optionsUsuario}
                        onChange={handleUsuarioChange}
                        placeholder="Selecione um usuario"
                />
                <select  name="nivel" value={selectCargo} onChange={cargoSelecionado}>
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

            </div>
            </form>

        </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx)=>{

    const apiClient = setupAPIClient(ctx)
    
    const usuario = await apiClient.get('/usuario/listausuario')
    const usuariocentrocusto = await apiClient.get('/usuccst')
    const cargo = await apiClient.get('/cargo')
    

    return{
        props:{
            listausuario: usuario.data[0].novo,
            listausuariocentrocusto: usuariocentrocusto.data[0].novo,
            cargos: cargo.data[0].novo
        }
    }
})
