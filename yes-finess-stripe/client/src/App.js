import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useState, useEffect} from 'react';
import './App.css';
import { BrowserRouter as Switch, Route } from 'react-router-dom';
import NavBar from './Components/NavBar';
import Subscribe from './Components/Subscribe';
import Success from './Components/Success';
import Failure from './Components/Failure';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import {getPrices} from './actions/';
//Reemplaza con la llave publica de stripe
const stripePromise = loadStripe('pk_test_51KXY80IbEvLuKsNlek1O6qZ3PmhAb9qf6O4alwOYHYs0TDotsduglBnBMagn320lg7qsZrGHiE6RhWyYMlpgtiyD0049mR7y5M');
function App() {
  const {prices} = useSelector(state=>state);
  const [pricesState, setState] = useState(prices)
  const dispatch = useDispatch();
  useEffect(() => {
    if(pricesState.length === 0)
    dispatch(getPrices())
    setState(prices);
   },[prices])
  return (
    <Switch>
      <Route path="/basic">
      <NavBar/>
      <Elements stripe={stripePromise}>
      <Subscribe price = {pricesState.length&&pricesState[0].id} amount = {pricesState.length&&pricesState[0].unit_amount.toString()} plan = {{name:"10 Clases",amount:10}} />
      </Elements>
      </Route>
      <Route path="/standar">
      <NavBar/>
      <Elements stripe={stripePromise}>
      <Subscribe price = {pricesState.length&&pricesState[1].id} amount = {pricesState.length&&pricesState[1].unit_amount.toString()} plan = {{name:"20 Clases",amount:20}} />
      </Elements>
      </Route>
      <Route path="/premium">
      <NavBar/>
      <Elements stripe={stripePromise}>
      <Subscribe price = {pricesState.length&&pricesState[2].id} amount = {pricesState.length&&pricesState[2].unit_amount.toString()} plan = {{name:"30 Clases",amount:30}} />
      </Elements>
      </Route>
      <Route path="/success">
        <Success />
      </Route>
      <Route path="/failure/:id">
        <Failure />
      </Route>
    </Switch>
  );
}

export default App;
