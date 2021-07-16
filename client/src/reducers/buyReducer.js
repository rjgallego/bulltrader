const buyReducer = (state=false, action) => {
    switch(action.type){
        case 'SHOW_BUY_MODAL':
            return true
        case 'HIDE_BUY_MODAL':
            return false
        default:
            return state;
    }
}

export default buyReducer;