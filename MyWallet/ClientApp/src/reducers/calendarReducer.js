const mes = new Date().getMonth();

const initialState = {
    valor : (mes + 1)
}

const valorReducer = (state = initialState, action)=>{
    switch(action.type){
        case "alterar":
            return {...state, valor: action.payload};
        default:
            return state;
    }
}

export default valorReducer