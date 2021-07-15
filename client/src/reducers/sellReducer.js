const sellReducer = (state=false, action) => {
    switch(action.type){
        case 'SHOW_SELL':
            return true
        case 'HIDE_SELL':
            return false
        default:
            return state;
    }
}

export default sellReducer;