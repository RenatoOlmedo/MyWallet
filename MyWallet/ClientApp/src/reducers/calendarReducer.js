const initialState = {
    valor : 0
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