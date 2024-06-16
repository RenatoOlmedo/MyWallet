import React, { useEffect, useState } from 'react';
import { Card } from "./Card";
import { CardList } from "./CardList";
import { News } from "./News";
import BarChart from "./BarChart";
import authService from "./api-authorization/AuthorizeService";
import Calendar from './Calendar/Calendar';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ModalNews } from './Modal/ModalNews';

const rowStyle = {
    marginTop: '20px',
    display: 'flex'
};

const props = {
    User: "Renato Olmedo",
    Deposit: 3000,
    AmountInvested: 50000,
    CurrentHeritage: 55450,
    Withdraw: 1000,
    Profit: 3540,
    Month: "Abril",
    Result: 3450,
    CompletedOperations: [
        { FinancialOperation: "Venda Coberta ITUB4", Result: 2000 },
        { FinancialOperation: "Lançamento MGLU3", Result: 2000 },
        { FinancialOperation: "Venda papeis Vale3", Result: 2000 }
    ],
    OnGoingOperations: [
        { FinancialOperation: "Venda Coberta ITUB4", Result: 2000 },
        { FinancialOperation: "Lançamento MGLU3", Result: 2000 },
        { FinancialOperation: "Venda papeis Vale3", Result: 2000 }
    ],
    ExpectedOutcome: [
        { FinancialOperation: "Venda Coberta ITUB4", Result: 2000 },
        { FinancialOperation: "Lançamento MGLU3", Result: 2000 },
        { FinancialOperation: "Venda papeis Vale3", Result: 2000 }
    ],
    News: [
        { Title: "Queda do dolar", Body: "Durante o mes de março houve uma queda no valor do dolar" },
        { Title: "Aumento nas Vendas", Body: "No último trimestre, houve um aumento significativo nas vendas de produtos." },
        { Title: "Expansão Internacional", Body: "A empresa anunciou planos para expandir suas operações para mercados internacionais no próximo ano." },
        { Title: "Inovação em Tecnologia", Body: "Foi lançada uma nova linha de produtos com tecnologia de ponta, recebendo ótimas críticas dos clientes." }
    ],
    PeriodResults: [
        { Month: "Janeiro", Result: 4200 },
        { Month: "Fevereiro", Result: 2850 },
        { Month: "Março", Result: 3100 },
        { Month: "Abril", Result: 2150 },
        { Month: "Maio", Result: 4780 },
        { Month: "Junho", Result: 2000 }
    ]
};


// Wallet?id=47c461ef-cbf3-4013-887a-0233b1568c6d&year=2024&month=6


// async function getWalletData(userId) {
//     const response = await fetch(`/Wallet?id=${userId}&date=2024-05-05`);
//     return await response.json();
// }

async function getUsersData() {
    try {
        const response = await fetch(`/user`);
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch user data:', error);
        return [];
    }
}

export const Home = () => {
    const [userData, setUserData] = useState([]);
    const [walletData, setWalletData] = useState([]);
    const [userId, setUserId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isUser, setIsUser] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [logado, setLogado] = useState(false);
    const valorReducer = useSelector(state => state.valor)
    const [response, setResponse] = useState("")
    const [modalOpen, setModalOpen] = useState(false)
    const navigate = useNavigate()

    async function getWalletData(userId) {
        const response = await fetch(`/Wallet?id=${userId}&year=2024&month=${valorReducer.valor}`);
        return await response.json();
    }

    useEffect(() => {
        async function initialize() {
            console.log("mes", valorReducer.valor)
            try {
                const user = await authService.getUser();
                console.log('User:', user);
                if (user) {
                    setLogado(true)
                    setUserId(user.sub);
                    const userRoles = await authService.getUserRoles();
                    setIsAdmin(userRoles.includes('Admin'));
                  
                    const walletData = await getWalletData(user.sub);
                    setResponse(walletData);
                   
                }
               
            } catch (error) {
                console.error('Initialization error:', error);
            } finally {
                setIsLoading(false);
            }
        }

        async function fetchUserData() {
            try {
                const userData = await getUsersData();
                console.log('User Data:', userData);
                setUserData(userData);
            } catch (error) {
                console.error('Fetch user data error:', error);
            }
        }

        initialize();
        fetchUserData();
    }, [valorReducer.valor]);

    const estiloPersonalizado = {
        flex: '1'
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    function fecharModal() {
        setModalOpen(false);
    }

    return (
        <>
        
         {logado ?
         <>
          <p>{isAdmin}</p>
            <p>{isUser}</p>
            {!isAdmin ? (
                <div>
                    <div className="row align-items-center">
                        <div className="col-lg-2 col-sm-6">
                            <Card title={"Cliente"} text={response.user} />
                        </div>
                        <div className="col-lg-2 col-sm-6">
                            <Card title={"Valor Investido"} text={response.amountInvested} />
                        </div>
                        <div className="col-lg-2 col-sm-6">
                            <Card title={"Depositos"} text={response.deposit} />
                        </div>
                        <div className="col-lg-2 col-sm-6">
                            <Card title={"Saques"} text={response.withdraw} />
                        </div>
                        <div className="col-lg-2 col-sm-6">
                            <Card title={"Lucros"} text={response.profit} />
                        </div>
                        <div className="col-lg-2 col-sm-6">
                            <Card title={"Patrimonio atual"} text={response.currentHeritage} />
                        </div>
                    </div>
                    <div className="row flex" style={rowStyle}>
                        <div className="col-lg-3 col-md-6 col-sm-6 d-flex flex-column">
                            <div style={estiloPersonalizado}>
                                {/* <Card title={"Mês"} text={props.Month} /> */}
                                <Calendar ></Calendar>
                            </div>
                            <div style={estiloPersonalizado}>
                                <Card title={"Resultado"} text={response.result} />
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6 d-flex flex-column">
                            <CardList title={"Operações Realizadas"} ops={props.CompletedOperations} />
                        </div>
                        <div className="col-lg-3 col-sm-6 d-flex flex-column">
                            <CardList title={"Operações em Andamento"} ops={props.OnGoingOperations} />
                        </div>
                        <div className="col-lg-3 col-sm-6 d-flex flex-column">
                            <CardList title={"Lucro Provisório"} ops={props.ExpectedOutcome} />
                        </div>
                    </div>
                    <div className="row flex" style={rowStyle}>
                        <div className="col-lg-6 col-sm-12">
                            <BarChart props={props.PeriodResults} />
                        </div>
                        <div className="col-lg-6 col-sm-12">
                            <News props={props.News} />
                        </div>
                    </div>
                </div>
            ) : (
                <>
                <ModalNews open={modalOpen} onClose={fecharModal}/>
                <div className='container'>
                    <div className='row justify-content-center'>
                        <div className='col-12 text-end'>
                            <button onClick={()=>{
                                setModalOpen(true)
                            }} className='btn btn-primary'>Adicionar notícia</button>
                        </div>

                        <div className='col-12 mt-5'>
                        <ul className="list-group">
                            {userData.map((op, index) => (
                                <li key={index} className="list-group-item"><a href={`/wallets/${op.userId}`}>{op.userName}</a></li>
                            ))}
                        </ul>
                        </div>
                    </div>
                </div>
                </>
            )}
         </>
        :
        <div>Não logado</div>
        }
        </>
    );
};