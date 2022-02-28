import {
    CREATE_SUBSCRIPTOR,
    GET_PRICES,
    SET_PRICE,
} from '../actions/constant.js';

const initialState = {
    prices: [],
    price:{},
    subscriptor: {}
}
export default function reducer(state = initialState, { type, payload }) {
    switch (type) {

        case GET_PRICES:
           payload.sort((a,b)=>{
            if(a.unit_amount>b.unit_amount){
                 return 1
                }
            else if(a.unit_amount<b.unit_amount) {
                    return -1
                } 
            return 0
        })
            return {
                ...state,
                prices: payload
            };
        case SET_PRICE:
            return {
                ...state,
                price: payload
            };
        case CREATE_SUBSCRIPTOR:
            return {
                ...state,
                subscriptor:payload
            };
        default:
            return state;
        }
}

