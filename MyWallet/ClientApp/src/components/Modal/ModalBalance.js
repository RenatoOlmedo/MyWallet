import React, { useEffect, useState } from "react";
import { RetornoModal } from "./RetornoModal";

export const ModalBalace = ({ onClose, open, userId }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [balance, setBalance] = useState();
    const [retornoModal, setRetornoModal] = useState({
        cor: "",
        texto: "",
        open: false
    });
    const [qtedeInvestments, setQtdeInvestments] = useState(1);
    const [newBalance, setNewBalance] = useState({
        balance:"",
        investments:[{
            operation:"",
            result:""
        }]
    });

    const[jatem, setJatem] = useState(false)

    async function getBalance(){
        const response = await fetch(`Wallet/GetHeritage?userId=${userId}`)
        const data = response.json()
        return data
    }

    useEffect(() => {

        async function initialize(){
            var resposta = await getBalance()
            console.log(`resposta`, resposta)
            if(resposta.investments == null){
                var novoInvestimento = [{
                    operation:"",
                    result:""
                }]
                setNewBalance(antiga => ({
                    ...antiga,
                    investments:novoInvestimento
                }))
            }   
            else{
                setNewBalance(resposta)
            }
        }
        initialize()
    }, [userId,open]);




    function fecharModal() {
        setModalOpen(false);
        onClose();
    }

    async function CriaInvestment(e, tipo){
        e.preventDefault()
    
        console.log(newBalance);

        const response = await fetch(`Wallet/CreateHeritage?userId=${userId}`,{
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(newBalance)
        })
        if(response.ok){
            setRetornoModal({cor:'success', texto:'Investimento cadastrado com sucesso',open:true})
            setTimeout(function(){
                setRetornoModal({open:false})
            },2000)
          
            fecharModal()
        }
        else{
            setRetornoModal({cor:'danger', texto:'Erro ao cadastrar investimento',open:true})
            setTimeout(function(){
                setRetornoModal({open:false})
            },2000)

        }
    }

    return (
        <>
            <RetornoModal corProps={retornoModal.cor} textoProps={retornoModal.texto} openProps={retornoModal.open} />
            <div className={`modal ${open ? "" : "fechada"}`}>
                <div className="fecha-modal" onClick={fecharModal}></div>
                <div className="container conteudo-modal p-lg-5 py-3">
                    <div className="row justify-content-center">
                        <div className="col-12 text-end position-relative">
                            <div onClick={fecharModal} className="close"></div>
                        </div>
                        <div className="col-12">    
            <h3 className="text-black text-center mb-3">Criar caixa</h3>            
                <form onSubmit={CriaInvestment}>

                                <label className="form-label" htmlFor={`balanceOperation`}>
                                    Caixa
                                </label>
                <div className="input-group">
                <span class="input-group-text">R$</span>
                                <input
                                    type="number"
                                    step='any'
                                    className="form-control"
                                    id={`balanceOperation`}
                                    required
                                    value={newBalance.balance}
                                    onChange={(e)=>{
                                       setNewBalance({...newBalance,balance:parseFloat(e.target.value)})
                                    }}
                                   
                                />
                            </div>
                    {newBalance.investments.map((investment, index) => (
                        <>
                        <div className="row my-3">
                        <div key={index} className="col-md-6 col-12">
                            <div className="-input-group">
                                <label className="form-label" htmlFor={`nameOperation_${index}`}>
                                    Operação
                                </label>
                                <input
                                    className="form-control"
                                    id={`nameOperation_${index}`}
                                    required
                                    value={newBalance.investments[index].operation}
                                    onChange={(e)=>{
                                      setNewBalance({
                                        ...newBalance,
                                        investments: newBalance.investments.map((item, idx)=>
                                        idx === index ? {...item, operation:e.target.value} : item)
                                      })
                                    }}
                                   
                                />
                            </div>
                        </div>

                        <div key={index} className="col-md-6 col-12">
                            <label className="form-label" htmlFor={`resultOperation_${index}`}>
                                    Valor Atual
                                </label>
                            <div className="input-group">
                                  <span class="input-group-text">R$</span>
                                <input
                                type="number"
                                step='any'
                                    className="form-control"
                                    id={`resultOperation_${index}`}
                                    required
                                    value={newBalance.investments[index].result}
                                    onChange={(e) =>{
                                        setNewBalance({
                                            ...newBalance,
                                            investments: newBalance.investments.map((item, idx)=>
                                            idx === index ? {...item, result:parseFloat(e.target.value)} : item)
                                          })
                                    }}
                                />
                            </div>
                        </div>
                        <div className="text-end d-flex justify-content-end">
                        <div
                            onClick={() => {
                              var update = [...newBalance.investments]
                              update.splice(index,1)
                              setNewBalance(antiga =>({
                                ...antiga, investments:update
                              })) 
                            }}
                            className="delete"
                        ></div>
                     </div>
                        </div>

                        </>
                    ))}

<button className="btn btn-primary mt-3" onClick={()=>{

const novo = {operation:"", result:""}
setNewBalance(antiga => ({
    ...antiga,
    investments:[...antiga.investments, novo]
}))
setQtdeInvestments(qtedeInvestments+1)
}}>
                    Adicionar Investimento
                </button>

                    <div className="text-center">
                            <button className="btn btn-primary mt-3 " type="submit">
                            Salvar
                        </button>
                    </div>
                </form>
            
            </div>
                    </div>
                </div>
            </div>
        </>
    );
};
