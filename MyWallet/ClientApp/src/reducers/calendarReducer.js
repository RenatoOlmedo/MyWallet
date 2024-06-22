const mes = new Date().getMonth() + 1;
const ano = new Date().getFullYear()
const initialState = {
    mes : mes,
    ano:ano
}

const valorReducer = (state = initialState, action)=>{
    switch(action.type){
        case "mes":
            return {...state, mes: action.payload};
        case "ano":
            return {...state, ano: action.payload};
        default:
            return initialState;
    }
}

export default valorReducer