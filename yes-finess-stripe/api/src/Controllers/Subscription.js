require('dotenv').config();
const {PRIVATE, PUBLISHABLE} = process.env
const stripe = require('stripe')(PRIVATE);
const { Router } = require("express");
const router = Router();
router.post("/create-subscription", async (req, res, next) => {
  try {
    const {priceId, customerId }= req.body;
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      cancel_at_period_end: true,
      items: [
        {
          price: priceId,
        },
      ],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });
    //almacenar datos de subscription en firebase
    // res.send({
    //   subscriptionId: {id:subscription.id, dateStart:new Date(subscription.current_period_start*1000).toLocaleDateString("en-US").toString(), 
    //     dateEnd:new Date(subscription.current_period_end*1000).toLocaleDateString("en-US").toString()},
    //   clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    //   clientPublishable: PUBLISHABLE,
    //   customerId,
    //   priceId
    // });
    res.send({
      subscriptionId: {id:subscription.id, dateStart:subscription.current_period_start, 
        dateEnd:subscription.current_period_end},
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      clientPublishable: PUBLISHABLE,
      customerId,
      priceId
    });
  }catch(error){
    next(error);
}
});
router.post("/cancel-subscription", async (req, res, next) => {
  try {
    const deletedSubscription = await stripe.subscriptions.del(
      req.body.subscriptionId
    );

    res.send({ subscription: deletedSubscription });
  }catch(error){
    next(error);
}
});

router.post("/update-subscription", async (req, res, next) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(
      req.body.subscriptionId
    );
    const updatedSubscription = await stripe.subscriptions.update(
      req.body.subscriptionId,
      {
        items: [
          {
            id: subscription.items.data[0].id,
            price: req.body.price,
          },
        ],
      }
    );
      console.log(updatedSubscription)
    res.send({ subscription: updatedSubscription });
  }catch(error){
    next(error);
}
});
router.get('/', async (req, res, next) => {
  try{
  const {customerId} = req.body;
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'all',
    expand: ['data.default_payment_method'],
  });
  res.json({subscriptions:subscriptions.data});
}catch(error){
  next(error);
}
});
module.exports = router;
