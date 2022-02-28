import React from 'react';
import style from './styles.module.css';
import { ReactComponent as Yes } from '../../Assets/Images/yesMedium.svg';
import {URL} from '../../actions/constant'
const SuccessCreate = ()=>{
    return(
        <div className = {style.container}>
             <Yes/>
            <span>¡Tu pago ha sido</span>
            <span>realizado correctamente!</span>
            <div className = "separator" style = {{marginTop:"65%"}}></div>
            <div className = {style.button}><a href = {`${URL}success`}>Volver al inicio</a></div>
        </div>
    )
}
export default SuccessCreate;