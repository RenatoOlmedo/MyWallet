import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { ModalWallet } from "../Modal/ModalWallet";


export const UserWallet = () =>{
    const [wallet, setWallet] = useState(null);
    const [carregado, setCarregado] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [userName, setUserName] = useState("")

    const {id} = useParams();

    useEffect(()=>{
       var carteira = getWallet(id).then((res)=>{
        setUserName(res.userName)
        setWallet(res.walletList)
        console.log("carteira", res)
        setCarregado(true)
       })
    },[id])

    function abreModal(){
        setModalOpen(true)
        console.log('aberto', modalOpen)
    }
    function fecharModal() {
        setModalOpen(false);
    }

    async function getWallet(id){
        var response = await fetch(`/Wallet/listWallet?userId=${id}`);
        var data = response.json()
        return data;
    }
    return (
        <>
        { carregado ?
            <>
            <ModalWallet user="" open={modalOpen} onClose={fecharModal}></ModalWallet> 
            <div class="container pt-5">
                <div class="row justify-content-center">
                    <div class="col-12">
                        <h1 class="text-center" onClick={abreModal}>Carteira de {userName}</h1>
                    </div>
                    <div class="col-12">
                       <div class="table-responsive">
                        <table class="table table-striped table-hover mt-5">
                            <thead>
                                <tr>
                                    <th class="" width="25%" colspan="4">Resultado</th>
                                    <th class="" width="25%" colspan="4">Mês</th>
                                    <th class="" width="25%" colspan="4">Ano</th>
                                    <th class="" width="25%" colspan="4">#</th>

                                </tr>
                                {wallet.map((item, index) =>(
                                    <tr>
                                        <td colSpan={4}>{item.result}</td>
                                        <td colSpan={4}>{item.month}</td>
                                        <td colSpan={4}>{item.year}</td>
                                        <td colSpan={4}>
                                            <button className="btn btn-primary">Editar</button>
                                        </td>
                                    </tr>
                                ))}
                            </thead>
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
        </>
    )
}

