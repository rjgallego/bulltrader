import buyReducer from './buyReducer';
import userReducer from './userReducer';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    buyReducer,
    userReducer
});

export default rootReducer;