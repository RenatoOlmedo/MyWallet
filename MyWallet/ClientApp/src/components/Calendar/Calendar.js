
import { connect } from "react-redux"
import alterarValor from '../../actions/calendarAction'
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from "react";

const Calendar = ({valor, alterarValor}) => {

    const valorReducer = useSelector(state => state.valor)
    const [mes, setMes] = useState("")
    const dispatch = useDispatch()
   
    useEffect(()=>{
        const date = new Date()
        const month = date.getMonth();
        dispatch({
            type:"alterar",
            payload:(month + 1)
        })
        setMes(month)
    },[])

    function ChangeCalendar(valor) {
        dispatch({
            type: "alterar",
            payload: (valor )
        })
        setMes(valor)
        console.log(valor)
    }

    const meses = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

return(
    <>
     <div className="row justify-content-end m-0 p-0">
        <div className="col-12 p-0">
        <select onChange={(e) =>ChangeCalendar(e.target.value)} className="select-calenda mt-3 form-select">
            {meses.map((item, index) => (
                <option key={index} value={index + 1} selected={(index ) === mes}>{item}</option>
            ))}
        </select>
        </div>
     </div>
    </>
)

}

export default Calendar