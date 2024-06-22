
import { connect } from "react-redux"
import alterarValor from '../../actions/calendarAction'
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from "react";

const Calendar = ({valor, alterarValor}) => {

    const valorReducer = useSelector(state => state.valor)
    const [mes, setMes] = useState("")
    const [year, setYear] = useState("")
    const [calendar, setCalendar] = useState({
        mes:"",
        ano:""
    })
    const dispatch = useDispatch()
   
    useEffect(()=>{
        const date = new Date()
        const month = date.getMonth();
        const anoAtual = date.getFullYear();
        setYear(anoAtual)
        dispatch({ type: "mes", payload: month + 1 });
        dispatch({ type: "ano", payload: anoAtual });
        setMes(month)
    },[])

    function ChangeCalendar(valor, type) {
        
        dispatch({
            type: type,
            payload: (valor )
        })
        setMes(valor)
        console.log(valor)
    }

    const meses = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
    const ano = [2021,2022,2023,2024,2025,2026,2027];

return(
    <>
     <div className="row justify-content-end m-0 p-0">
        <div className="col-12 col-md-6 p-0">
        <select onChange={(e) =>ChangeCalendar(e.target.value, "mes")} className="select-calendar mt-3 form-select">
            {meses.map((item, index) => (
                <option key={index} value={index + 1} selected={(index ) === mes}>{item}</option>
            ))}
        </select>
        </div>

        <div className="col-12 col-md-6 p-0">
        <select onChange={(e) =>ChangeCalendar(e.target.value,"ano")} className="select-calendar mt-3 form-select">
            {ano.map((item, index) => (
                <option key={index} value={item} selected={(item ) === year}>{item}</option>
            ))}
        </select>
        </div>
     </div>
    </>
)

}

export default Calendar