import {GET_PRICES,SET_PRICE,
CREATE_SUBSCRIPTOR, URL} from './constant.js';
const axios = require('axios').default;


export function getPrices(){
    return function(dispatch){
        axios.get(`${URL}prices`)
        .then(res=>{
            dispatch({type: GET_PRICES,payload:res.data.prices})
        });
    }
}
export function setPrice(payload){
    return function(dispatch){
            dispatch({type: SET_PRICE,payload})
    }
}
export function createSubscriptor(payload){
    return function(dispatch){
        axios.post(`${URL}create-subscriptor`,payload)
        .then(res=>{
            dispatch({type: CREATE_SUBSCRIPTOR,payload:res.data})
        });
    }
}

