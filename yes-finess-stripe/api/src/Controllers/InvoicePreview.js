// const {Router} = require("express")
// require('dotenv').config();
// const {PRIVATE} = process.env
// const stripe = require('stripe')(PRIVATE);
// const router = Router();

// router.get('/', async (req, res, next) => {
//     try{
//     const customerId = req.cookies['customer'];
//     const priceId = process.env[req.query.newPriceLookupKey.toUpperCase()];
  
//     const subscription = await stripe.subscriptions.retrieve(
//       req.query.subscriptionId
//     );
  
//     const invoice = await stripe.invoices.retrieveUpcoming({
//       customer: customerId,
//       subscription: req.query.subscriptionId,
//       subscription_items: [ {
//         id: subscription.items.data[0].id,
//         price: priceId,
//       }],
//     });
  
//     res.send({ invoice });
//   }catch(error){
//     next(error);
// }
//   });
  
//   module.exports = router;