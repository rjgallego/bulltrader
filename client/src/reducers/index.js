import buyReducer from './buyReducer';
import userReducer from './userReducer';
import sellReducer from './sellReducer';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    buyReducer,
    userReducer,
    sellReducer
});

export default rootReducer;