import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { ModalWallet } from "../Modal/ModalWallet";


export const UserWallet = () =>{
    const [wallet, setWallet] = useState("");
    const [carregado, setCarregado] = useState(false);
    const [modalOpen, setModalOpen] = useState(false)

    const {id} = useParams();

    useEffect(()=>{
       var carteira = getWallet(id).then((res)=>{
        setWallet(res[0])
        console.log("carteira", res[0])
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
                        <h1 class="text-center" onClick={abreModal}>Carteira de Id {wallet.walletId}</h1>
                    </div>
                    <div class="col-12">
                       <div class="table-responsive">
                        <table class="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <td class="" width="25%" colspan="4">Resultado</td>
                                    <td class="" width="25%" colspan="4">Mês</td>
                                    <td class="" width="25%" colspan="4">Ano</td>
                                    <td class="" width="25%" colspan="4"></td>

                                </tr>
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

