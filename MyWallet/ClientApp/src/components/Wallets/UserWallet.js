import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { ModalWallet } from "../Modal/ModalWallet";
import { ModalBalace } from "../Modal/ModalBalance";


export const UserWallet = () =>{
    const [wallet, setWallet] = useState(null);
    const [carregado, setCarregado] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalBalance, setModalBalance] = useState(false);
    const [userName, setUserName] = useState("")
    const [year, setYear] = useState("")
    const [month, setMonth] = useState("")
    const [tipoModal, setTipoModal] = useState("")
    const [mudou, setMudou] = useState()
    

    const {id} = useParams();

    useEffect(()=>{
       var carteira = getWallet(id).then((res)=>{
        setUserName(res.userName)
        setWallet(res.walletList)
        console.log("carteira", res)
        setCarregado(true)
       })
    },[id, mudou])

    const retornaMudanca = (mudanca) =>{
        setMudou(mudou +1)
    }


    function abreModal(year, month, tipo){
        setTipoModal(tipo)
        setYear(year)
        setMonth(month)
        setModalOpen(true)
    }
    function fecharModal() {
        setModalOpen(false);
    }
    function fecharModalBalance() {
        setModalBalance(false);
    }

    async function getWallet(id){
        var response = await fetch(`/Wallet/listWallet?userId=${id}`);
        var data = response.json()
        return data;
    }
    return (
        <>
        <section id="userList">
        { carregado ?
            <>
            <ModalBalace  onClose={fecharModalBalance} open={modalBalance} userId={id}></ModalBalace>
            {modalOpen ? 
            <>
            <ModalWallet mudanca={retornaMudanca} type={tipoModal} userProps={userName} userId={id} yearProps={year} monthProps={month} open={modalOpen} onClose={fecharModal}></ModalWallet> 
            </>
            :
            ""
            }
            <div class="container pt-5">
                <div class="row justify-content-center">
                    <div className="col-12">
                        <a href="/" className="-btn-voltar text-white">Voltar</a>
                    </div>
                 
                    <div class="col-12">
                        <h1 class="text-center" >Carteira de {userName}</h1>
                    </div>

                    <div className="row justify-content-end align-items-center">

                
                    <div className="col-lg-2 col-md-4 col-12 text-end">
                        <button onClick={()=> setModalBalance(true)} className="btn-danger btn text-white">Patrimônio</button>
                    </div>
                   

                    <div className="col-lg-1 col-md-3 col-12 text-end  mt-4 mt-md-0">
                            <button className="btn btn-primary" onClick={() =>{
                                setTipoModal(`adicionar`);
                                setModalOpen(true)
                            }}>Adicionar</button>
                    </div>
                    </div>
                    <div class="col-12">
                       <div class="table-responsive">
                        <table class="table table-striped table-hover mt-5">
                            <thead>
                                <tr>
                                    <th class="" width="25%" colspan="4">Mês</th>
                                    <th class="" width="25%" colspan="4">Ano</th>
                                    <th className="" width="25%" colSpan="4">Resultado</th>
                                    <th class="" width="25%" colspan="4">#</th>

                                </tr>
                                </thead>
                                {wallet.map((item, index) =>(
                                    <tr>
                                        <td colSpan={4}>{item.month}</td>
                                        <td colSpan={4}>{item.year}</td>
                                        <td colSpan={4}>{item.result}</td>
                                        <td colSpan={4}>
                                            <button onClick={()=>abreModal(item.year, item.month,'update')} className="btn btn-secondary">Editar</button>
                                        </td>
                                    </tr>
                                ))}
                            
                        </table>
                       </div>
                    </div>
                </div>
            </div>
            </>

          : 

          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        }     
        </section>
        </>
    )
}

