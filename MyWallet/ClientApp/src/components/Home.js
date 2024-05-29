import React, { useEffect, useState } from 'react';
import { Card } from "./Card";
import { CardList } from "./CardList";
import { News } from "./News";
import BarChart from "./BarChart";
import authService from "./api-authorization/AuthorizeService";

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

async function getWalletData(userId) {
    const response = await fetch(`/wallet?id=${userId}&date=2024-05-05`);
    return await response.json();
}

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

    useEffect(() => {
        async function initialize() {
            try {
                const user = await authService.getUser();
                console.log('User:', user);
                if (user) {
                    setUserId(user.sub);
                    const userRoles = await authService.getUserRoles();
                    console.log('User Roles:', userRoles);
                    setIsAdmin(userRoles.includes('Admin'));
                    setIsUser(userRoles.includes('User'));
                    if (userId) {
                        const walletData = await getWalletData(userId);
                        console.log('Wallet Data:', walletData);
                        setWalletData(walletData.user);
                    }
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
    }, []);

    const estiloPersonalizado = {
        flex: '1'
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <p>{isAdmin}</p>
            <p>{isUser}</p>
            {!isAdmin ? (
                <div>
                    <div className="row">
                        <div className="col-lg-2 col-sm-6">
                            <Card title={"Cliente"} text={props.User} />
                        </div>
                        <div className="col-lg-2 col-sm-6">
                            <Card title={"Valor Investido"} text={props.AmountInvested} />
                        </div>
                        <div className="col-lg-2 col-sm-6">
                            <Card title={"Depositos"} text={props.Deposit} />
                        </div>
                        <div className="col-lg-2 col-sm-6">
                            <Card title={"Saques"} text={props.Withdraw} />
                        </div>
                        <div className="col-lg-2 col-sm-6">
                            <Card title={"Lucros"} text={props.Profit} />
                        </div>
                        <div className="col-lg-2 col-sm-6">
                            <Card title={"Patrimonio atual"} text={props.CurrentHeritage} />
                        </div>
                    </div>
                    <div className="row flex" style={rowStyle}>
                        <div className="col-lg-3 col-md-6 col-sm-6 d-flex flex-column">
                            <div style={estiloPersonalizado}>
                                <Card title={"Mês"} text={props.Month} />
                            </div>
                            <div style={estiloPersonalizado}>
                                <Card title={"Resultado"} text={props.Result} />
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
                <ul className="list-group">
                    {userData.map((op, index) => (
                        <li key={index} className="list-group-item"><a href={`/Wallets?userId=${op.userId}`}>{op.userName}</a></li>
                    ))}
                </ul>
            )}
        </>
    );
};