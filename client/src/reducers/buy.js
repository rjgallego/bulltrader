const buyReducer = (state=false, action) => {
    console.log(action.type)
    switch(action.type){
        case 'SHOW':
            return true
        case 'HIDE':
            return false
        default:
            return state;
    }
}

export default buyReducer;