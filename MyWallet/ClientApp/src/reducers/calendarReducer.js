const mes = new Date().getMonth() + 1;

const initialState = {
    valor : 10  
}

const valorReducer = (state = initialState, action)=>{
    switch(action.type){
        case "alterar":
            return {...state, valor: action.payload};
        default:
            return initialState;
    }
}

export default valorReducer