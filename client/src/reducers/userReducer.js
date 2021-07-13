function userReducer(state = {}, action){
    switch(action.type){
        case "ADD_USER":
            return {
                ...state,
                user: action.payload
            };
        case "UPDATE_USER_STOCKS":
            return Object.assign({}, state, {
                stocks: action.payload
            })
        default:
            return state;
    }
}

export default userReducer;