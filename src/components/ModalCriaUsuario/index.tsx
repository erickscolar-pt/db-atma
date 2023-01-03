import Modal from 'react-modal'
import style from './style.module.scss'

import { FiX } from 'react-icons/fi'
import { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import { setupAPIClient } from '../../services/api';

type cargo = {
    idcarg_carg: number,
    nome_carg: string
}

interface ModalProps{
    isOpen: boolean;
    onRequestClose: () => void;
    itemCargo: cargo[]
}
export function ModalCriaUsuario({ isOpen,onRequestClose, itemCargo }:ModalProps){

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    //const [nivel, setNivel] = useState(0)
    const [selectNivel, setSelectNivel] = useState(0)
    const [cargo, setCargo] = useState(0)

    function nivelSelecionado(event){
        ////console.log(event.target.value)
        //setNivel(event.tarde.value)
        setSelectNivel(event.target.value)
    }

    console.log(itemCargo)

    
    async function handleRegistro(event:FormEvent) {
        //setNivel(selectNivel)
        event.preventDefault();
        let nivel: number = 0
        if(selectNivel == 1 ){
            nivel = 1
        }
    
        if(selectNivel == 2 ){
            nivel = 2
        }

        //console.log(selectNivel)

/*         //console.log(username)
        //console.log(password)
        //console.log(selectNivel) */

        if(username === '' || password === '' || selectNivel == 0){
            toast.warn("Insira todos os campos para prosseguir")
            return;
        }
/* 
{
"nome":"erick.moreira@atmatec.com.br",
"senha":"Neo@$.31082019",
"nivel":1,
"cargo":1
}
*/
/*
idccst_usucc: number;
idusu_usucc: number; 
*/
        const api = setupAPIClient();
        await api.post('/auth/signup',{
            nome: username,
            senha: password,
            nivel: nivel,
            cargo: cargo
        }).catch((err)=>{
            //console.log(err)
            toast.error("Não foi possivel criar usuario, tente novamente mais tarde.")
            return;
        })

        toast.success("Usuario criado com sucesso.")

        setUsername('')
        setPassword('')

    }

    const customStyles = {
        content:{
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'transparent',
            border: 'none'
        },
    }

    return(
        <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        style={customStyles}
        >
            <button type='button'
                onClick={onRequestClose}
                className="react-modal-close"
                style={{ background:'transparent', border: 0 }}
            >
                <FiX
                    size={35}
                    color='#000'
                />
            </button>

            <form action="" className={style.form} onSubmit={handleRegistro}>
                <h1>Criar Usuario</h1>
                <input  type="text" 
                        name="username" 
                        placeholder='Nome de Usuario'
                        value={username}
                        onChange={(e)=>setUsername(e.target.value)}
                        />

                <input  type="password" 
                        name="password" 
                        placeholder='Senha'
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        />
                <select name="nivel" value={selectNivel} onChange={nivelSelecionado}>
                    <option value="">Selecione o Nivel</option>
                    <option value="1">Admin</option>
                    <option value="2">Operador</option>
                </select>
                <button type='submit'>Criar</button>
            </form>
        </Modal>
    )
}