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
    nivel_ccst: string
}
type ItemPropsUsuario = {
    idusu_usu: number,
    nivel_usu: number,
    idcarg_usu: number,
    login_usu: string
}
interface Listas {
    listacentrocusto: ItemPropsCentroCusto[]
    listausuario: ItemPropsUsuario[]
    listausuariocentrocusto: ItemPropsUsuarioCentroCusto[]
}

export default function NovoUsuarioCentroCusto(
    {listacentrocusto,listausuario, listausuariocentrocusto}:Listas,
    JsonCC
    ){
    const [listaCentroCusto, setListaCentroCusto] = useState(listacentrocusto || []);
    const [listaUsuarios, setListaUsuarios] = useState(listausuario || []);
    const [listaUsuarioCentroCusto, setListaUsuarioCentroCusto] = useState(listausuariocentrocusto || []);
    const [selectUsuario, setSelectUsuario] = useState([]);
    const [selectCentroCusto, setSelectCentroCusto] = useState([]);
    const [desibleId, setDesibleId] = useState([0])
        


    selectCentroCusto.map((li)=>{return li.value})

    const jsonCC = []

    if(selectCentroCusto.length > 0){
        selectCentroCusto.map((li)=>{
            jsonCC.push(
            { idusu_usucc: selectUsuario['value'], 
              idccst_usucc: li.value }
            )
        })
    }
    
    /* usuario */
      const result = listaUsuarioCentroCusto.filter(lista=>lista.idusu_usucc == selectUsuario['value'])
      const optionsUsuario = [
        { value: 0, label: '' },
      ];

      listaUsuarios.map((lista)=>{
        optionsUsuario.push({value: lista.idusu_usu, label: lista.login_usu})
      })

      const handleUsuarioChange =  async (selected, selectaction) => {
      const { action } = selectaction;
        setSelectUsuario(selected);
      }
      /* fim usuario */

      /* centro custo */
       const optionsCentroCusto = [
        {value:0, label:''}
       ];

       const arrayId = []

        result.forEach(elem => {
            arrayId.push(elem.idccst_usucc);       
        })

       listaCentroCusto.forEach((listaCc)=>{
        if(selectUsuario['value'] !== 0){
            if(result.length > 0){
                    if(arrayId.indexOf(listaCc.idccst_ccst) === -1){
                        optionsCentroCusto.push({
                            value: listaCc.idccst_ccst, label: listaCc.nivel_ccst + ' - ' + listaCc.nome_ccst
                        })
                    }
            } else {
                    optionsCentroCusto.push({
                        value: listaCc.idccst_ccst, label: listaCc.nivel_ccst + ' - ' + listaCc.nome_ccst
                    })
                }
        }
        })
        
      const handleCentroCustoChange = async (selected, selectaction) => {
        const { action } = selectaction;
        //console.log(`action ${action}`);
        if (action === "clear") {
        } else if (action === "select-option") {
            console.log("add");
            selectCentroCusto.map((li)=>{
                jsonCC.push(
                { idusu_usucc: selectUsuario['value'], 
                  idccst_usucc: li.value }
                )
            })
        } else if (action === "remove-value") {
            console.log("remove");
        }
        setSelectCentroCusto(selected);
    };
    /* fim centro custo */

    /* registro usu centro custo */
    function registerUsoCc(){
        
        if(jsonCC.length <= 0){
            toast.warning('Insira todos os dados para salvar')
        } else {
            jsonCC.forEach((item)=>{
                if(item.idusu_usucc == 0 || item.idccst_usucc == 0){
                    toast.warning('Insira um dado correto para gravação')
                } else {
                    handleRegistroUsuCentroCusto(item.idusu_usucc,item.idccst_usucc)
                }
                //console.log(item.idusu_usucc + ' ' + item.idccst_usucc)
            })
        }

    }
    async function handleRegistroUsuCentroCusto(idusu_usucc,idccst_usucc){

        const apiClient = setupAPIClient();
        await apiClient.post('/usuccst',{
            idusu_usucc: idusu_usucc,
            idccst_usucc: idccst_usucc
        }).then(()=>{
            Router.reload()
            toast.success('gravado com sucesso')
        }).catch((err)=>{
            console.log(err)
            toast.error('erro ao gravar')
        })
    }
    /* fim registro usu centro custo */
    /* deletar centro de custo usu */
    async function excluiCentroDeCustoUsuario(id) {
        const apiClient = setupAPIClient();
        await apiClient.delete('/usuccst/id',{
            data:{
                idusucc_usucc:id
            }
        }).then(()=>{
            Router.reload()
            toast.success('Item excluido')
        }).catch(()=>{
            toast.error('Erro ao excluir')
        })
    }
    /* fim deletar centro de custo usu */

    return(
        <>
        <Head>
            <title>Novo Usuario Centro de Custo</title>
        </Head>
        <Header/>


        <div className={styles.content}>
            <form >
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
            </div>
                
            <div className={styles.remove}>
            <h1>Lista centro de custo</h1>
            {result.length > 0 ?
            <div className={styles.itens}>
                {result.map((id)=>{
                        return(
                            <div key={id.idccst_usucc} className={styles.removeitem}>
                            <div key={id.idccst_usucc} className={styles.nameitem}>
                                <p>{listaCentroCusto.map((lista)=>{
                                    return(
                                            lista.idccst_ccst == id.idccst_usucc ? lista.nivel_ccst + ' - ' + lista.nome_ccst : <></>
                                        )
                                    })}
                                </p>
                            </div>
                            <button type="button" onClick={() => excluiCentroDeCustoUsuario(id.idusucc_usucc)}><MdRemove size={25} color="#fff"/></button>
                            </div>
                        )
                })}
            </div>:<></>}                
            </div>

            <div className={styles.add}>
                <div className={styles.item}>
                    <Select
                        className={styles.select}
                        id="selectCentroCusto"
                        instanceId="selectCentroCusto"
                        isMulti
                        name="centroCusto"
                        classNamePrefix="select"
                        options={optionsCentroCusto}
                        onChange={handleCentroCustoChange}
                        placeholder="Selecione centro de custo"
                    />
                    <button type="button" onClick={()=> registerUsoCc()}><MdAdd size={25} color="#fff"/></button>

                </div>
            </div>

            </form>
        <Footer/>

        </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx)=>{

    const apiClient = setupAPIClient(ctx)
    
    const centrocusto = await apiClient.get('/centrocusto')
    const usuario = await apiClient.get('/usuario/listausuario')
    const usuariocentrocusto = await apiClient.get('/usuccst')
    

    return{
        props:{
            listacentrocusto: centrocusto.data[0].novo,
            listausuario: usuario.data[0].novo,
            listausuariocentrocusto: usuariocentrocusto.data[0].novo
        }
    }
})
