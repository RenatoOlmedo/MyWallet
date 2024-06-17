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
    const [news, setNews] = useState()
    const [results, setResults] = useState()
    const [resultsCarregado, setResultsCarregado] = useState(false)
    const navigate = useNavigate()


    const props = {
        user:response.user,
        deposit: 'No DATA',
        amountInvested: 'No DATA',
        currentHeritage: 'No DATA',
        withdraw: 'No DATA',
        profit: 'No DATA',
        Month: "Abril",
        result: 'No DATA',
        completedOperations: [
            { financialOperation: "", result: 'No DATA' },
        ],
        onGoingOperations: [
            { financialOperation: "No Data", result: 'No DATA' }
        ],
        expectedOutcome: [
            { financialOperation: "No Data", Result: 'No DATA' }
        ]
    };
    
  
    async function getWalletData(userId) {
        console.log(`valor reducer`, valorReducer.valor)
        const response = await fetch(`/Wallet?id=${userId}&year=2024&month=${valorReducer.valor }`);
        return await response.json();
    }
    async function getResults(userId){
        const result = await fetch(`Wallet/GetPeriodResult?userId=${userId}`)
        const data = await result.json();
       return data;
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
                  
                    try{
                        const walletData = await getWalletData(user.sub);
                    setResponse(walletData);
                    }
                    catch{
                        setResponse(props)
                    }
                    console.log('wallet',walletData)
                    
                        const resultados = await getResults(user.sub)
                        setResults(resultados)
                    
                   
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

        async function fetchNews(){
            const news = await fetch('/News', {
                method:'GET'
            })
            const data = await news.json();
            console.log(data)
            setNews(data)
        }
       
        
       

        initialize();
        fetchUserData();
        fetchNews();
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
                            <CardList title={"Operações Realizadas"} ops={response.completedOperations} />
                        </div>
                        <div className="col-lg-3 col-sm-6 d-flex flex-column">
                            <CardList title={"Operações em Andamento"} ops={response.onGoingOperations} />
                        </div>
                        <div className="col-lg-3 col-sm-6 d-flex flex-column">
                            <CardList title={"Resultado Esperado"} ops={response.expectedOutcome} />
                        </div>
                    </div>
                    <div className="row flex" style={rowStyle}>
                        <div className="col-lg-6 col-sm-12">
                            <BarChart props={results.periodResults} />
                        </div>
                        <div className="col-lg-6 col-sm-12">
                            <News props={news} />
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