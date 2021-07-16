const sellReducer = (state=false, action) => {
    switch(action.type){
        case 'SHOW_SELL_MODAL':
            return true
        case 'HIDE_SELL_MODAL':
            return false
        default:
            return state;
    }
}

export default sellReducer;