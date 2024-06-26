import React, { useEffect, useState } from 'react';
import { Card } from "./Card";
import { CardList } from "./CardList";
import { News } from "./News";
import BarChart from "./BarChart";
import authService from "./api-authorization/AuthorizeService";
import Calendar from './Calendar/Calendar';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
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
    const [fixedResponse, setFixedResponse] = useState("")
    const [modalOpen, setModalOpen] = useState(false)
    const [news, setNews] = useState()
    const [results, setResults] = useState();
    const [User, setUser] = useState(null)
    const [resultsCarregado, setResultsCarregado] = useState(false)
    const navigate = useNavigate()
    const {logged} = useParams();


    // const props = {
    //     user:response.user,
    //     Month: "Abril",
    //     result: 'NÃO HÁ OPERAÇÕES',
    //     completedOperations: [
    //         { financialOperation: "", result: 'NÃO HÁ OPERAÇÕES' },
    //     ],
    //     onGoingOperations: [
    //         { financialOperation: "NÃO HÁ OPERAÇÕES", result: 'NÃO HÁ OPERAÇÕES' }
    //     ],
    //     expectedOutcome: [
    //         { financialOperation: "NÃO HÁ OPERAÇÕES", Result: 'NÃO HÁ OPERAÇÕES' }
    //     ]
    // };
    
    // const fixedProps = {
    //     deposit: 0,
    //     amountInvested: 0,
    //     currentHeritage: 0,
    //     withdraw: 0,
    //     profit: 0,
    //     balance: 0,
    // }
    
  
    async function getWalletData(userId, valor) {
        const response = await fetch(`/Wallet?id=${userId}&year=${valor.ano}&month=${valor.mes}`);
        return await response.json();
    }

    async function getFixedWalletData(userId, valor) {
        const response = await fetch(`Wallet/GetFixedInfos?id=${userId}`);
        return await response.json();
    }
    
    async function getResults(userId){
        const result = await fetch(`Wallet/GetPeriodResult?userId=${userId}`)
        const data = await result.json();
       return data;
    }


    useEffect(() => {
        async function initialize() {
            console.log("ano", valorReducer.ano)
            try {
                const user = await authService.getUser();
                console.log('User:', user);
                if (user) {
                     
                    console.log('user', user)
                    setUser(user)
                    setLogado(true)
                    setUserId(user.sub);
                    const userRoles = await authService.getUserRoles();
                    setIsAdmin(userRoles.includes('Admin'));
                    if(isAdmin){
                            fetchUserData();
                        }
                        else if(user.role == "User"){
                            try{
                                const walletData = await getWalletData(user.sub, valorReducer);
                                
                                console.log('response', walletData)
                                
                            setResponse(walletData);
                            }
                            catch{
                                setResponse([])
                                setFixedResponse([])
                            }
                            console.log('wallet',walletData)
                            
                            const resultados = await getResults(user.sub)
                            const walletfixedData = await getFixedWalletData(user.sub, valorReducer);
                            
                            setResults(resultados)
                            setFixedResponse(walletfixedData);
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

        async function fetchNews(){
            const news = await fetch('/News', {
                method:'GET'
            })
            const data = await news.json();
            console.log(data)
            setNews(data)
        }
        
    //    fetchUserData()
        fetchNews();
        initialize( )
    }, [valorReducer.ano, valorReducer.mes, isAdmin,userId,logged]);

    const estiloPersonalizado = {
        flex: '1'
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    function fecharModal() {
        setModalOpen(false);
    }

    function valorFormatado(valor){
        if(valor != undefined){
            return valor.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })
        }
        return null
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
                        <div className='col-12'>
                            <h3 className='h3-user text-black mb-3'>Bem vindo {User.name}!</h3>
                        </div>
                        <div className="col-lg-2 col-sm-6">
                            <Card title={"Caixa"} text={valorFormatado(fixedResponse.balance)} />
                        </div>
                        <div className="col-lg-2 col-sm-6">
                            <Card title={"Valor Investido"} text={valorFormatado(fixedResponse.amountInvested)} />
                        </div>
                        <div className="col-lg-2 col-sm-6">
                            <Card title={"Depositos"} text={valorFormatado(fixedResponse.deposit)} />
                        </div>
                        <div className="col-lg-2 col-sm-6">
                            <Card title={"Saques"} text={valorFormatado(fixedResponse.withdraw)} />
                        </div>
                        <div className="col-lg-2 col-sm-6">
                            <Card title={"Lucros"} text={valorFormatado(fixedResponse.profit)} />
                        </div>
                        <div className="col-lg-2 col-sm-6">
                            <Card title={"Patrimonio atual"} text={valorFormatado(fixedResponse.currentHeritage)} />
                        </div>
                    </div>
                    <div className="row flex" style={rowStyle}>
                        <div className="col-lg-3 col-md-6 col-sm-6 d-flex flex-column">
                            <div style={estiloPersonalizado}>
                                {/* <Card title={"Mês"} text={props.Month} /> */}
                                <Calendar ></Calendar>
                            </div>
                            <div style={estiloPersonalizado}>
                                <Card title={"Resultado"} text={valorFormatado(response.result)} />
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6 d-flex flex-column">
                            <CardList classeProps={`pequeno`}  title={"Operações Realizadas"} ops={response.completedOperations} />
                        </div>
                        <div className="col-lg-3 col-sm-6 d-flex flex-column">
                            <CardList classeProps={`pequeno`} title={"Operações em Andamento"} ops={response.onGoingOperations} />
                        </div>
                        <div className="col-lg-3 col-sm-6 d-flex flex-column">
                            <CardList classeProps={`pequeno`} title={"Resultado Esperado"} ops={response.expectedOutcome} />
                        </div>
                    </div>
                    <div className="row flex" style={rowStyle}>
                        <div className="col-lg-6 col-sm-12">
                            <BarChart classeProps={`barras`} props={results.periodResults} />
                        </div>
                        <div className="col-lg-6 col-sm-12">
                            <News classeProps={`noticias`} title={"Informações"} props={news} />
                        </div>
                    </div>
                </div>
            ) : (
                <>
                <ModalNews open={modalOpen} onClose={fecharModal}/>
                <div className='container'>
                    <div className='row justify-content-center'>
                        <div className='col-12 text-end'>
                            <a href='/news' className='btn btn-primary'>Adicionar notícia</a>
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