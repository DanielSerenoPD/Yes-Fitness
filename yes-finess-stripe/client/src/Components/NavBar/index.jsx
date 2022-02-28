import React from 'react';
import style from './styles.module.css';
import { ReactComponent as Yes } from '../../Assets/Images/yes.svg';
import back from '../../Assets/Images/back.png';
import {URL} from '../../actions/constant'
const NavBar = ()=>{
    return(
        <nav className = {style.navBar}>
        <a href = {`${URL}close`}><img src = {back} alt = "back" width = "25px" height = "25px"/></a>
        <span className = {style.logo}><Yes/></span>
       </nav>
    )
}
export default NavBar;