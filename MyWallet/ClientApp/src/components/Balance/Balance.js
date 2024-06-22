import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { ModalBalace } from "../Modal/ModalBalance"

export const Balance = () =>{
    const [balance, setBalance] = useState()
    const [jaTem, setJatem] = useState(false)
    const {id} = useParams()
    const [modalOpen, setModalOpen] = useState(false);
    const [newBalance, setNewBalance] = useState({
        balance: "",
        investments: [
            {
                operation: "",
                result: ""
            }
        ]
    });
    const [type, setType] = useState("");
    const [mudou, setMudou] = useState()

    async function getBalance(){
        const response = await fetch(`Wallet/GetHeritage?userId=${id}`)
        const data = response.json()
        return data
    }
    useEffect(()=>{
        
        async function initialize(){
            var resposta = await getBalance()
            console.log(`resposta`, resposta)
            if(resposta.heritageId == null){
                setJatem(false)
            }
            else{
                setBalance(resposta)
                setJatem(true)
            }
        }
        initialize()
    },[id,mudou])

    const recebeMudanca = (mudanca) =>{
        setMudou(mudou + 1)
        setNewBalance(mudanca)
    }


    function abreModal(item, type) {
        setModalOpen(true);
        setType(type);
        setNewBalance({
            balance: item.balance,
            investments: item.investments
        });
    }

    function fecharModal() {
        setModalOpen(false);
    }


    return (
        <>
         <ModalBalace mudanca={recebeMudanca} onClose={fecharModal} open={modalOpen} typeProps={type} balance={newBalance} userId={id}></ModalBalace>
        {
            jaTem ? 
            <>
                   <div className="container">
                        <div className="row justify-content-center">
     
                            <div className="col-12">
                                <h1 className="text-center h3-user">Caixa - R$ {balance.balance}</h1>
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover mt-5">
                                        <thead>
                                            <tr>
                                               
                                                <th width="33%" colSpan="4">Operação</th>
                                                <th className="text-center" width="33%" colSpan="4">Resultado</th>
                                                <th className="text-center" width="33%" colSpan="4">#</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                           
                                               
                                                    {balance.investments.map((item, index)=>(
                                                        <>
                                                         <tr >
                                                            <td colSpan={4}>{item.operation}</td>
                                                            <td colSpan={4}>{item.result}</td>
                                                            <td>
                                                                <button onClick={() => { abreModal(balance, 'update') }} className="btn-primary btn">Editar</button>
                                                            </td>
                                                            </tr>
                                                        </>
                                                    ))}
                                                
                                               
                                          
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
            </>

            :
           <>
           
            <div className="col-12 mb-5 text-end">
                <button onClick={() => { abreModal(newBalance, 'add') }} className="btn btn-primary">Adicionar Balanco</button>
            </div>
           </>
        }
        
        </>
    )
}