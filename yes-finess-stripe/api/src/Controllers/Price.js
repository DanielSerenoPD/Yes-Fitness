require('dotenv').config();
const {PRIVATE} = process.env
const stripe = require('stripe')(PRIVATE);
const {Router} = require("express")
const router = Router()
router.get('/', async (req, res, next) => {
  try{
    const prices = await stripe.prices.list({
      lookup_keys: ['10_clases', '20_clases', '30_clases'],
      expand: ['data.product']
    });
    res.send({
      publishableKey: process.env.PUBLISHABLE,
      prices: prices.data,
    });
  }catch(error){
    next(error);
}
})
module.exports = router;