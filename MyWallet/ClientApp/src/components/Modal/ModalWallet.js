import { useEffect, useState } from "react"


export const ModalWallet = ({userProps,userId,yearProps, monthProps, open,onClose, type}) =>{

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
            status:0,
        }],
        expectedOutcomes:[{
            expectedOutcomeId:"",
            expectedResult:"",
            financialOperation:""
        }],
        year:"",
        month:"",
        amountInvested:"",
        deposit:"",
        withdraw:"",
        profit:"",
        currentHeritage:""
    })
    const[qtdeOperations, setQtdeOperations] = useState(0)

    useEffect(()=>{
        setCarregado(true)
        async function getWallet(){
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
                    console.log(res.operations.length)
                    // setQtdeOperations(res)
                    setOpened(open)
                    setCarregado(true)
                })
            }catch{
                setOpened(false)
            }
        }
    },[])
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
            }
        }catch{
            setCarregado(false)
        }
    }

    const retornoTipo = type == `update` ?  
    <div class="col-10 text-center pt-5">
          <form onSubmit={(e) => HandleSubmit(e,'PUT',"")}>
        {/* <input onChange={(e)=> setWallet({...wallet, walletId:e.target.value})} className="form-control" value={wallet.walletId} type="text" readOnly/> */}

        {
    Array.from({ length: qtdeOperations }, (_, index) => (
        <div key={index}>
            <div className="operations pb-3">
                <div className="text-start mb-3">
                    <label className="form-label" htmlFor={`nameOperation_${index }`}>Nome da operação</label>
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

                <div className="text-start mb-3">
                    <label className="form-label" htmlFor={`resultOperation_${index}`}>Resultado da operação</label>
                    <input
                    required
                        value={wallet.operations[index].result}
                        onChange={(e) => setWallet({
                            ...wallet,
                            operations: wallet.operations.map((operation, idx) => 
                                idx === index ? { ...operation, result: e.target.value } : operation
                            )
                        })}
                        id={`resultOperation_${index}`}
                        className="form-control"
                    />
                </div>

                <div className="text-start mb-3">
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
                        <option value={1}>Completa</option>
                        <option value={2}>Em andamento</option>
                    </select>
                </div>
            <hr />
            </div>
        </div>
    ))
}

        <div className="text-start mb-3">
            <label className="form-label" htmlFor="resultOutcome">Resultado esperado</label>
            <input value={wallet.expectedOutcomes[0].expectedResult} onChange={(e)=> setWallet({...wallet,expectedOutcomes:[{...wallet.expectedOutcomes[0], expectedResult:e.target.value},...wallet.expectedOutcomes.slice(1)] })} id="resultOutcome" className="form-control" />
        </div>
        
        <div className="text-start mb-3">
            <label className="form-label" htmlFor="totalInvestido">Nome da operação</label>
            <input className="form-control" id="totalInvestido" value={wallet.amountInvested} onChange={(e) => setWallet({...wallet, amountInvested:e.target.value})}/>
        </div>

        <div className="text-start mb-3">
            <label className="form-label" htmlFor="aporteInvestido">Aporte</label>
            <input className="form-control" id="aporteInvestido" value={wallet.deposit} onChange={(e) => setWallet({...wallet, deposit:e.target.value})}/>
        </div>

        <div className="text-start mb-3">
            <label className="form-label" htmlFor="saque">Saque</label>
            <input className="form-control" id="saque" value={wallet.withdraw} onChange={(e) => setWallet({...wallet, withdraw:e.target.value})}/>
        </div>

        <div className="text-start mb-3">
            <label className="form-label" htmlFor="lucro">Resultado</label>
            <input className="form-control" id="lucro" value={wallet.profit} onChange={(e) => setWallet({...wallet, profit:e.target.value})}/>
        </div>

        <div className="text-start mb-3">
            <label className="form-label" htmlFor="total">Patrimônio</label>
            <input className="form-control" id="total" value={wallet.currentHeritage} onChange={(e) => setWallet({...wallet, currentHeritage:e.target.value})}/>
        </div>

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
</div>

        <div className="text-center">
            <button type="submit" className="btn btn-primary px-5 py-2 rounded-5">Salvar</button>
        </div>


    </form>
    </div>
    :
    <div class="col-10 text-center pt-5">
    <form onSubmit={(e) => HandleSubmit(e,'POST',"CreateWallet")}>
        {/* <input onChange={(e)=> setWallet({...wallet, walletId:e.target.value})} className="form-control" value={wallet.walletId} type="text" readOnly/> */}

        <input type="hidden" value={wallet.userId}></input>

        <div className="text-start mb-3">
            <label className="form-label" htmlFor="nameOperation">Nome da operação</label>
            <input onChange={(e)=> setWallet({...wallet,operations:[{...wallet.operations[0], financialOperation:e.target.value},...wallet.operations.slice(1)] })} id="nameOperation" className="form-control" value={wallet.operations[0].financialOperation}/>
        </div>

        <div className="text-start mb-3">
            <label className="form-label" htmlFor="resultOperation">Resultado da operação</label>
            <input value={wallet.operations[0].result} onChange={(e)=> setWallet({...wallet,operations:[{...wallet.operations[0], result:e.target.value},...wallet.operations.slice(1)] })} id="resultOperation" className="form-control" />
        </div>

        <div className="text-start mb-3">
            <label className="form-label" htmlFor="statusOperation">Status da operação</label>
            <select value={wallet.operations[0].status} onChange={(e)=> setWallet({...wallet,operations:[{...wallet.operations[0], status:parseInt(e.target.value)},...wallet.operations.slice(1)] })} id="statusOperation" className="form-select">
                <option value={1}>Completa</option>
                <option value={2}>Em andamento</option>
            </select>
        </div>

        <div className="text-start mb-3">
            <label className="form-label" htmlFor="resultOutcome">Resultado esperado</label>
            <input value={wallet.expectedOutcomes[0].expectedResult} onChange={(e)=> setWallet({...wallet,expectedOutcomes:[{...wallet.expectedOutcomes[0], expectedResult:e.target.value},...wallet.expectedOutcomes.slice(1)] })} id="resultOutcome" className="form-control" />
        </div>

        <div className="text-start mb-3">
            <label className="form-label" htmlFor="year">Ano da operação</label>
            <input className="form-control" id="year" value={wallet.year} onChange={(e) => setWallet({...wallet, year:parseInt(e.target.value)})}/>
        </div>

        <div className="text-start mb-3">
            <label className="form-label" htmlFor="year">Mês da operação</label>
            <input className="form-control" id="year" value={wallet.month} onChange={(e) => setWallet({...wallet, month:parseInt(e.target.value)})}/>
        </div>
        
        <div className="text-start mb-3">
            <label className="form-label" htmlFor="totalInvestido">Nome da operação</label>
            <input className="form-control" id="totalInvestido" value={wallet.amountInvested} onChange={(e) => setWallet({...wallet, amountInvested:e.target.value})}/>
        </div>

        <div className="text-start mb-3">
            <label className="form-label" htmlFor="aporteInvestido">Aporte</label>
            <input className="form-control" id="aporteInvestido" value={wallet.deposit} onChange={(e) => setWallet({...wallet, deposit:e.target.value})}/>
        </div>

        <div className="text-start mb-3">
            <label className="form-label" htmlFor="saque">Saque</label>
            <input className="form-control" id="saque" value={wallet.withdraw} onChange={(e) => setWallet({...wallet, withdraw:e.target.value})}/>
        </div>

        <div className="text-start mb-3">
            <label className="form-label" htmlFor="lucro">Resultado</label>
            <input className="form-control" id="lucro" value={wallet.profit} onChange={(e) => setWallet({...wallet, profit:e.target.value})}/>
        </div>

        <div className="text-start mb-3">
            <label className="form-label" htmlFor="total">Patrimônio</label>
            <input className="form-control" id="total" value={wallet.currentHeritage} onChange={(e) => setWallet({...wallet, currentHeritage:e.target.value})}/>
        </div>

        <div className="text-center">
            <button type="submit" className="btn btn-primary px-5 py-2 rounded-5">Editar</button>
        </div>


    </form>
    </div>

    return (
        <>
           <div class={`modal ${opened ? '' : 'fechada'}`}>
            <div class="fecha-modal" onClick={fecharModal}></div>
                <div class="container conteudo-modal p-lg-5 py-3">
                  
                   {carregado ? 
                    <div class="row justify-content-center">
                            <div className="col-12 text-end">
                                <div className="close"><i class="bi bi-x-lg"></i></div>
                            </div>
                        <div class="col-12">
                            <h1 className="text-center text-black">Carteira de {userProps} - {monthProps}/{yearProps}</h1>
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