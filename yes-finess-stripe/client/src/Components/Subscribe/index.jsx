import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Cookies from 'universal-cookie';
import { Redirect } from "react-router-dom";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import "../../index.css";
import style from "./styles.module.css";
import checkout from "../../Assets/Images/lock.png";
import { createSubscriptor } from "../../actions";
import { URL } from "../../actions/constant";
const Subscribe = ({price, amount, plan}) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [customer, setCustomer] = useState({});
  const [suscription, setSubscription] = useState({});
  const [messages, _setMessages] = useState("");
  const [paymentIntent, setPaymentIntent] = useState({status:false});
  const setMessage = (message) => {
    _setMessages(`${messages}\n\n${message}`);
  };
  useEffect(() => {}, [customer]);
  //iniciamos stripe

  const stripe = useStripe();
  const elements = useElements();

  if (!stripe || !elements) {
    //comprobamos que stripe y elements esten inicializados
    return "";
  }

  //   1. TGeneramos el token de pago
  //   2. Creamos la subscripcion
  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${URL}create-customer`, { name }).then((res) => {
      setCustomer(res.data.customer);
     
      axios
        .post(`${URL}subscription/create-subscription`, {
          priceId:price,
          customerId: res.data.customer.id,
        })
        .then(async (res) => {
          setSubscription(res.data.subscriptionId);
          const cardElement = elements.getElement(CardNumberElement);
          let { error, paymentIntent } = await stripe.confirmCardPayment(
            res.data.clientSecret,
            {
              payment_method: {
                card: cardElement,
                billing_details: {
                  name: name,
                },
              },
            }
          );

          if (error) {
            setMessage(error.message);
            setPaymentIntent(null);
          } else {
            setPaymentIntent(paymentIntent);
            return;
          }
        });
    });
  };

  if (paymentIntent && paymentIntent.status === "succeeded") {
    const cookies = new Cookies();
    console.log(suscription.dateStart)
    cookies.set('customerId',customer.id,{path:'/'})
    cookies.set('clases',plan.amount,{path:'/'})
    cookies.set('subscriptionID',suscription.id,{path:'/'})
    cookies.set('subscriptionStart',suscription.dateStart,{path:'/'})
    cookies.set('subscriptionEnd',suscription.dateEnd,{path:'/'})
    cookies.set('plan',price,{path:'/'})
    return <Redirect to="/success" />;
  }else if(!paymentIntent){
    return <Redirect to={`/failure/${plan.amount}`}/>;
  }
  return (
    <div className={style.container}>
      <div className={style.item}>
      <img src={checkout} alt="stripe" width="30" height="30" />
        <span className = {style.primaryText}>Check out</span>
      </div>
      <div className = {style.plan}>
      <span className = {style.secondaryText}>
        ${amount.length&&amount.substring(0, amount.length-2) + " MXN"}
      </span>
        <span className = {style.primaryText}>{plan.name}</span>
        <p>Vigencia 30 dias, Renovacion automatica.</p>
      </div>
      <form className={style.form} onSubmit={(e) => handleSubmit(e)}>
      <div className = "separator"></div>
        <label>Nombre</label>
        <input
          className = {style.border}
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Ingresa el nombre que figura en la tarjeta"
        />
        <label>Numero de tarjeta</label>
        <div className={style.border}>
          <CardNumberElement
            options={{
              style: {
                base: inputStyle,
              },
            }}
          />
        </div>
        <div className = {style.flex}>
        <div className = {style.card} style = {{width:"60%"}}>
        <label>Fecha de expiracion</label>
        <div className = {style.border} style = {{minWidth:"60%"}}>
          <CardExpiryElement
            options={{
              style: {
                base: inputStyle,
              },
            }}
          />
          </div>
          </div>
          <div className = {style.card} style = {{width:"30%"}}>
          <label>CVC</label>
          <div className = {style.border} style = {{minWidth:"30%"}}>
          <CardCvcElement
            options={{
              style: {
                base: inputStyle,
              },
            }}
          />
          </div>
        </div>
</div> 
<div className = "separator"></div>
       <div className={style.justifyCenter}>
          <button>Pagar y suscribirme ahora</button>
        </div>
      </form>
    </div>
  );
};

const inputStyle = {
  iconColor: "#c4f0ff",
  color: "#black",
  fontWeight: "250",
  fontFamily: "Acumin, Open Sans, Segoe UI, sans-serif",
  fontSize: "16px",
  fontSmoothing: "antialiased",
  ":-webkit-autofill": {
    color: "black",
  },
  "::placeholder": {
    color: "black",
  },
  
  
};
export default Subscribe;
