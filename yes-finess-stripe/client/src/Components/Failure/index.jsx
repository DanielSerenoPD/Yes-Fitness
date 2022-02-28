import React,{useState} from 'react';
import { Redirect, useParams } from "react-router-dom";
import style from './styles.module.css';
const FailureCreate = ()=>{
    const [canBack, setCanBack] = useState(false)
    const {id}= useParams();
  if(canBack){
      if(id==10){
        return <Redirect to="/basic"/>
      }
      else if(id == 20){
        return <Redirect to="/standar"/>
      }
      else if(id == 30){
        return <Redirect to="/premium"/>
      }
      
    }
    return(
        <div className = {style.container}>
            <span>Lo sentimos, ha ocurrido</span>
            <span>un error con tu pago.</span>
            <div className = "separator" style = {{marginTop:"65%"}}></div>
            <button className = {style.button} onClick = {()=>setCanBack(true)}>Volver a intentar</button>
        </div>
    )
}
export default FailureCreate;