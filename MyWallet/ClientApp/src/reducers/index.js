import { combineReducers } from "redux";
import valorReducer from './calendarReducer'

const rootReducer = combineReducers({valor:valorReducer})

export default rootReducer
