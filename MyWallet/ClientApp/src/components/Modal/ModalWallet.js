import { useEffect, useState } from "react"
import { RetornoModal } from "./RetornoModal";


export const ModalWallet = ({userProps,userId,yearProps, monthProps, open,onClose, type, mudanca}) =>{

    const [userSe, setUser] = useState(userProps);
    const [opened, setOpened] = useState(open);
    const [carregado,setCarregado] = useState(false);
    const[year, setYear] = useState(yearProps);
    const [month, setMonth] = useState(monthProps)
    const [wallet, setWallet] = useState({
        walletId:"",
        userId:userId,
        operations:[{
            operationId:"",
            result:"",
            financialOperation:"",
            status:1,
            expectedOutcome:""
        }],
        year:"",
        month:"",
        amountInvested:"",
        deposits:[{
            depositId:"",
            value:""
        }],
        withdraws:[{
            withdrawId:"",
            value:""
        }],
        profit:"",
        currentHeritage:""
    })
    const[qtdeOperations, setQtdeOperations] = useState(1)
    const [qtdeDeposits, setQtdeDeposits] = useState(1)
    const [qtdeWithdraws, setQtdeWithdraws] = useState(1)
    const [retornoModal, setRetornoModal] = useState({
        cor:"",
        texto:"",
        open:false
    })


    useEffect(()=>{
        setCarregado(true)
        setYear("")
        setMonth("")
        async function getWallet(){
            setMonth(monthProps)
            setYear(yearProps)
            setCarregado(false)
            var response = await fetch(`Wallet/GetModal?id=${userId}&year=${yearProps}&month=${monthProps}`)
            var data = response.json();
            return data;
        }
        if(type == `update`){
            try{
                getWallet().then((res)=>{
                    setWallet(res)
                    setQtdeOperations(res.operations.length)
                    setQtdeDeposits(res.deposits.length)
                    setQtdeWithdraws(res.withdraws.length)
                    console.log(res.deposits.length)
                    // setQtdeOperations(res)
                    setOpened(open)
                    setCarregado(true)
                })
            }catch{
                setOpened(false)
            }
        }
    },[type])
    function fecharModal(){
        setOpened(false)
        onClose()
    }

    async function HandleSubmit(e, tipo, url){
        e.preventDefault();
        setCarregado(false)
        console.log(wallet)
        try{
            const response = await fetch(`/Wallet/${url}`,{
                method:tipo,
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(wallet)
            })
            if(response.ok){
                setCarregado(true)
                setRetornoModal({cor:'success',texto:'Sucesso!',open:true})
                fecharModal()
                setTimeout(function(){
                    setRetornoModal({open:false})
                },2000)
                mudanca(`ok`)
            }
        }catch{
            setCarregado(false)
            setRetornoModal({cor:'danger',texto:'Erro!',open:true})
            setTimeout(function(){
                setRetornoModal({open:false})
            },2000)
        }
    }

    const arrayDepositos = (<>
         {
         Array.from({ length: qtdeDeposits }, (_, index) => (
            <div key={index}>
                <hr />
                <div className="deposits pt-3">
                    <div className="text-start mb-3">
                        {/*<p><strong>Id do depósito {wallet.deposits[index].depositId}</strong></p>*/}
                        <label className="form-label" htmlFor={`valueDeposit_${index }`}>Valor do depósito</label>
                        <div className="input-group">
                        <span class="input-group-text">R$</span>
                        <input
                        type="number"
                        step="any"
                        required
                           onChange={(e) => setWallet({
                            ...wallet,
                            deposits: wallet.deposits.map((deposit, idx) => 
                                idx === index ? { ...deposit, value: parseFloat(e.target.value) } : deposit
                            )
                        })}
                            id={`valueDeposit_${index}`}
                            className="form-control"
                            value={wallet.deposits[index].value}
                        />
                        </div>
                    </div>
                    <div className="text-end d-flex justify-content-end">
                        <div onClick={()=>{
                            var update = [...wallet.deposits];
                            update.splice(index, 1)
                            setWallet(antigaWallet =>({
                                ...antigaWallet,
                                deposits:update
                            }))
                            setQtdeDeposits(qtdeDeposits -1)
                        }} className="delete"></div>
                    </div>
                
                </div>
            </div>
        ))
       }
       <div className="text-start">
    <button onClick={(e) => {
        e.preventDefault();
        setQtdeDeposits(qtdeDeposits + 1);

        // Cria uma nova operação vazia
        const newDeposit = {
            depositId:"",
            value:""
        };
        // Atualiza o estado wallet de forma imutável
        setWallet(prevWallet => ({
            ...prevWallet,
            deposits: [...prevWallet.deposits, newDeposit]
        }));
    }} className="btn btn-danger px-2 py-2 rounded-5 mb-5">Adicionar depósito</button>
        </div>
</>)

const arraySaques = (<>
  {
         Array.from({ length: qtdeWithdraws }, (_, index) => (
            <div key={index}>
                <hr />
                <div className="deposits pt-3">
                    <div className="text-start mb-3">
                        {/*<p><strong>Id do withdraw {wallet.withdraws[index].withdrawId}</strong></p>*/}
                        <label className="form-label" htmlFor={`valueWithdraw_${index }`}>Valor do Saque</label>
                        <div className="input-group">
                        <span class="input-group-text">R$</span>
                        <input
                         type="number"
                        step="any"
                        required
                           onChange={(e) => setWallet({
                            ...wallet,
                            withdraws: wallet.withdraws.map((withdraw, idx) => 
                                idx === index ? { ...withdraw, value: parseFloat(e.target.value) } : withdraw
                            )
                        })}
                            id={`valueWithdraw_${index}`}
                            className="form-control"
                            value={wallet.withdraws[index].value}
                        />
                        </div>
                    </div>
                    <div className="text-end d-flex justify-content-end">
                        <div onClick={()=>{
                            var update = [...wallet.withdraws];
                            update.splice(index, 1)
                            setWallet(antigaWallet =>({
                                ...antigaWallet,
                                withdraws:update
                            }))
                            setQtdeWithdraws(qtdeWithdraws -1)
                        }} className="delete"></div>
                    </div>
                
                </div>
            </div>
        ))
       }   
        <div className="text-start">
       <button onClick={(e) => {
           e.preventDefault();
           setQtdeWithdraws(qtdeWithdraws + 1);
   
           // Cria uma nova operação vazia
           const newWithdraw = {
               withdrawId:"",
               value:""
           };
           // Atualiza o estado wallet de forma imutável
           setWallet(prevWallet => ({
               ...prevWallet,
               withdraws: [...prevWallet.withdraws, newWithdraw]
           }));
       }} className="btn btn-danger px-2 py-2 rounded-5 mb-5">Adicionar Saque</button>
               </div></>)

const arrayOperations = (<>
 {
        Array.from({ length: qtdeOperations }, (_, index) => (
        <div key={index}>
            <hr />
            <div className="operations pt-3">
                <div className="text-start mb-3">
                    {/*<p><strong>Id da operação {wallet.operations[index].operationId}</strong></p>*/}
                    <label className="form-label" htmlFor={`nameOperation_${index }`}>Nome da operação</label>
                    <div className="input-group">
                   
                    <input
                    required
                       onChange={(e) => setWallet({
                        ...wallet,
                        operations: wallet.operations.map((operation, idx) => 
                            idx === index ? { ...operation, financialOperation: e.target.value } : operation
                        )
                    })}
                        id={`nameOperation_${index}`}
                        className="form-control"
                        value={wallet.operations[index].financialOperation}
                    />
                    </div>
                </div>

                <div className="text-start mb-3">
                    <label className="form-label" htmlFor={`expectedOperation_${index }`}>Expectativa da operação</label>
                    <div className="input-group">
                    <span class="input-group-text">R$</span>
                    <input
                     type="number"
                        step="any"
                    required
                       onChange={(e) => setWallet({
                        ...wallet,
                        operations: wallet.operations.map((operation, idx) => 
                            idx === index ? { ...operation, expectedOutcome: parseFloat(e.target.value) } : operation
                        )
                    })}
                        id={`expectedOperation_${index}`}
                        className="form-control"
                        value={wallet.operations[index].expectedOutcome}
                    />
                    </div>
                </div>

                    <div className="row">
                    <div className="text-start mb-3 col-md-6 col-12">
                    <label className="form-label" htmlFor={`resultOperation_${index}`}>Resultado da operação</label>
                    <div className="input-group">
                    <span class="input-group-text">R$</span>
                    <input
                    required
                     type="number"
                        step="any"
                        value={wallet.operations[index].result}
                        onChange={(e) => setWallet({
                            ...wallet,
                            operations: wallet.operations.map((operation, idx) => 
                                idx === index ? { ...operation, result: parseFloat(e.target.value) } : operation
                            )
                        })}
                        id={`resultOperation_${index}`}
                        className="form-control"
                    />
                    </div>
                </div>

                <div className="text-start mb-3 col-md-6 col-12">
                    <label className="form-label" htmlFor={`statusOperation_${index}`}>Status da operação</label>
                    <select
                    required
                        value={wallet.operations[index].status}
                        onChange={(e) => setWallet({
                            ...wallet,
                            operations: wallet.operations.map((operation, idx) => 
                                idx === index ? { ...operation, status: parseInt(e.target.value) } : operation
                            )
                        })}
                        id={`statusOperation_${index}`}
                        className="form-select"
                    >
                        <option selected={wallet.operations[index].status === 1} value={1}>Completa</option>
                        <option selected={wallet.operations[index].status === 2} value={2}>Em andamento</option>
                    </select>
                </div>
                    </div>
                <div className="text-end d-flex justify-content-end">
                    <div onClick={()=>{
                        var update = [...wallet.operations];
                        update.splice(index, 1)
                        setWallet(antigaWallet =>({
                            ...antigaWallet,
                            operations:update
                        }))
                        setQtdeOperations(qtdeOperations -1)
                    }} className="delete"></div>
                </div>
            
            </div>
        </div>
        ))
        }
          
          <div className="text-start">
    <button onClick={(e) => {
        e.preventDefault();
        setQtdeOperations(qtdeOperations + 1);

        // Cria uma nova operação vazia
        const newOperation = {
            operationId: "",
            result: "",
            financialOperation: "",
            status: 0
        };

        // Atualiza o estado wallet de forma imutável
        setWallet(prevWallet => ({
            ...prevWallet,
            operations: [...prevWallet.operations, newOperation]
        }));
    }} className="btn btn-danger px-2 py-2 rounded-5 mb-5">Adicionar operação</button>
        </div></>)

    const retornoTipo = type == `update` ?  
    <div class="col-10 text-center pt-5">
        {/* Modal de update */}
          <form onSubmit={(e) => HandleSubmit(e,'PUT',"")}>
        {/* <input onChange={(e)=> setWallet({...wallet, walletId:e.target.value})} className="form-control" value={wallet.walletId} type="text" readOnly/> */}

        {/* <div className="text-start mb-3">
            <label className="form-label" htmlFor="resultOutcome">Resultado esperado</label>
            <div className="input-group">
            <span class="input-group-text">R$</span>
            <input value={wallet.expectedOutcomes[0].expectedResult} onChange={(e)=> setWallet({...wallet,expectedOutcomes:[{...wallet.expectedOutcomes[0], expectedResult:e.target.value},...wallet.expectedOutcomes.slice(1)] })} id="resultOutcome" className="form-control" />
            </div>
        </div> */}
        
        {/* <div className="text-start mb-3">
            <label className="form-label" htmlFor="totalInvestido">Total da operação</label>
            <div className="input-group">
            <span class="input-group-text">R$</span>
            <input className="form-control" id="totalInvestido" value={wallet.amountInvested} onChange={(e) => setWallet({...wallet, amountInvested:e.target.value})}/>
            </div>
        </div> */}



            <div className="row">
                    {/* array de depositos */}
                    <div className="col-md-6 col-12">
                        <h2 className="text-start"><strong>Depósitos</strong></h2>
                        {arrayDepositos}
                    </div>

                     {/*array de withdraws*/}
                    <div className="col-md-6 col-12">
                        <h2 className="text-start"><strong>Saques</strong></h2>
                        {arraySaques}
                    </div>
                
            </div>

        {/*array de operacoes*/}
            <div className="">
                <h2 className="text-start"><strong>Operações</strong></h2>
                {arrayOperations}
            </div>
    

        <div className="text-center">
            <button type="submit" className="btn btn-primary px-5 py-2 rounded-5">Salvar</button>
        </div>


    </form>
    </div>
    :

    // Modal de cadastro
    <div class="col-10 text-center pt-5">
    <form onSubmit={(e) => HandleSubmit(e,'POST',"CreateWallet")}>
        {/* <input onChange={(e)=> setWallet({...wallet, walletId:e.target.value})} className="form-control" value={wallet.walletId} type="text" readOnly/> */}

        <input type="hidden" value={wallet.userId}></input>

        {/* <div className="text-start mb-3">
            <label className="form-label" htmlFor="resultOutcome">Resultado esperado</label>
            <div className="input-group">
                <span class="input-group-text">R$</span>
                <input value={wallet.expectedOutcomes[0].expectedResult} onChange={(e)=> setWallet({...wallet,expectedOutcomes:[{...wallet.expectedOutcomes[0], expectedResult:e.target.value},...wallet.expectedOutcomes.slice(1)] })} id="resultOutcome" className="form-control" />
            </div>
        </div> */}

        <div className="row">
            
        <div className="text-start mb-3 col-md-6 col-12">
            <label className="form-label" htmlFor="year">Ano da operação</label>
            <input type="number" className="form-control" id="year" value={wallet.year} onChange={(e) => setWallet({...wallet, year:parseInt(e.target.value)})}/>
        </div>

        <div className="text-start mb-3 col-md-6 col-12">
            <label className="form-label" htmlFor="month">Mês da operação</label>
            <input type="number" className="form-control" id="month" value={wallet.month} onChange={(e) => setWallet({...wallet, month:parseInt(e.target.value)})}/>
        </div>
        </div>
        
        {/* <div className="text-start mb-3">
            <label className="form-label" htmlFor="totalInvestido">Nome da operação</label>
            <input className="form-control" id="totalInvestido" value={wallet.amountInvested} onChange={(e) => setWallet({...wallet, amountInvested:e.target.value})}/>
        </div> */}

        <div className="row">
            <div className="col-md-6 col-12">
                  {/* array de depositos */}
            
                  {arrayDepositos}
            </div>

            <div className="col-md-6 col-12">
                      {/*array de withdraws*/}
            {arraySaques}
            </div>
        </div>

        {/* <div className="text-start mb-3">
            <label className="form-label" htmlFor="lucro">Resultado</label>
            <div className="input-group">
                <span class="input-group-text">R$</span>
                <input className="form-control" id="lucro" value={wallet.profit} onChange={(e) => setWallet({...wallet, profit:e.target.value})}/>
            </div>
        </div>

        <div className="text-start mb-3">
            <label className="form-label" htmlFor="total">Patrimônio</label>
            <div className="input-group">
            <span class="input-group-text">R$</span>
             <input className="form-control" id="total" value={wallet.currentHeritage} onChange={(e) => setWallet({...wallet, currentHeritage:e.target.value})}/>
            </div>
        </div> */}

        {/* array operacoes */}
        {arrayOperations}



        <div className="text-center">
            <button type="submit" className="btn btn-primary px-5 py-2 rounded-5">Salvar</button>
        </div>


    </form>
    </div>

    return (
        <>
           <RetornoModal corProps={retornoModal.cor} textoProps={retornoModal.texto} openProps={retornoModal.open} />
           <div class={`modal ${opened ? '' : 'fechada'}`}>
            <div class="fecha-modal" onClick={fecharModal}></div>
                <div class="container conteudo-modal p-lg-5 py-3">
                  
                   {carregado ? 
                    <div class="row justify-content-center">
                            <div className="col-12 text-end position-relative">
                                <div onClick={fecharModal} className="close"></div>
                            </div>
                        <div class="col-12 col-md-10">
                            <h1 className={`text-center text-black`}>Carteira de {userProps} <span className={type == "update" ? '' : 'd-none'}>- {monthProps}/{yearProps}</span></h1>
                        </div>
                    
                        {retornoTipo}
                    </div>
                    :

                    <div class="row justify-content-center align-items-center h-100">
                        <div class="col-12 text-center">
                            <div class="spinner-border" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                }
                </div>
           </div>
        </>
    )

}