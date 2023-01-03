import Modal from 'react-modal'
import style from './style.module.scss'

import { FiX } from 'react-icons/fi'
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { setupAPIClient } from '../../services/api';
import { canSSRAuth } from '../../utils/canSSRAuth';
import { ItemPropsMotivo } from '../../pages/dashboard'
import * as XLSX from 'xlsx'

interface ModalProps{
    isOpen: boolean;
    onRequestClose: () => void;
    listaMotivo: ItemPropsMotivo[]
}

export function ModalRelatorio({ isOpen,onRequestClose, listaMotivo }:ModalProps){

    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [selectMotivo, setSelectMotivo] = useState(0)
    const [sheetData, setSheetData] = useState(null)
    //const [dataRelatorio, setDataRelatorio] = useState('')

    function motivolSelecionado(event){
        //console.log(event.target.value)
        //setNivel(event.tarde.value)
        setSelectMotivo(event.target.value)
    }

    function handleExport(data){
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

        //console.log(datahora)

        var wb = XLSX.utils.book_new(),
        ws = XLSX.utils.json_to_sheet(data);

        XLSX.utils.book_append_sheet(wb, ws, "Relatorio")

        XLSX.writeFile(wb, "relatorio" + datahora + ".xlsx");

        toast.success("Download concluido.")
    }

    async function handleRegistro(event:FormEvent) {
        event.preventDefault();
        //console.log('Data ini: ' + dataInicio+"T00:00:00.000Z")
        //console.log('Data fim: ' + dataFim+"T23:59:00.000Z")
        let motivoSelecionado = listaMotivo[selectMotivo]
        let motivoEnviado = [0]

        //console.log(selectMotivo)
        if(selectMotivo == 1001){
            motivoEnviado = [999999]
        }else if(selectMotivo == 1000){
            motivoEnviado = [1,2,3,4,5,6,7,8,9,999999]
        } else {
            motivoEnviado = [listaMotivo[selectMotivo].idmtv_mtv]
        }
        //console.log(motivoEnviado)

        if(dataInicio === '' || dataFim === ''){
            toast.warn("Insira todos os campos para prosseguir")
            return;
        }
        /* dataVencimento + ":00.000Z" */

        const api = setupAPIClient();
        const response:any = await api.post('/atendimento/findDataMotivo',{
            dtvcn_ini: dataInicio+"T00:00:00.000Z",
            dtvcn_fin: dataFim+"T23:59:00.000Z",
            origem_ini: motivoEnviado
        }).catch((err)=>{
            //console.log(err)
            toast.error("Não foi possivel baixar o relatorio, tente novamente mais tarde.")
            return;
        })
        //console.log(response.data)
        //console.log(response.data[0].novo)

        //setDataRelatorio(response.data[0].novo)
        if(response.data[0].novo.length == 0){
            toast.warning("Não possui dados para o relatorio.")
            return;
        }

        handleExport(response.data[0].novo)
        
        //console.log('Data => '+ JSON.stringify(sheetData))
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
                <h1>Relatorio</h1>
                <p>Data Inicio</p>
                <input type="date" placeholder="Data Inicio"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    />
                <p>Data Fim</p>
                <input type="date" placeholder="Data Fim"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                />
                <select name="nivel" value={selectMotivo} onChange={motivolSelecionado}>
                    <option value="1001" key={0}>Acordo</option>
                    <option value="1000" key={55}>Todos os Motivo</option>
                    {listaMotivo.map((motivos, index)=>{
                            return(
                                motivos.idmtv_mtv === 999999 ? <></> :
                                <option value={index} key={motivos.idmtv_mtv}>{motivos.nome_mtv}</option>
                                                            )
                        })}
                </select>
                <button type='submit' >Baixar</button>
            </form>
        </Modal>
    )
}