require('dotenv').config();
const {PRIVATE} = process.env
const {Router} = require('express');
const stripe = require('stripe')(PRIVATE);
const router = Router();
router.post('/', async (req, res, next) => {
  try{
    const customer = await stripe.customers.create({
      name: req.body.name,
    });
    console.log(req.body.name)
    res.send({ customer: customer });
  }catch(error){
      next(error);
  }
});

router.post('/update', async (req, res, next) => {
  try{
  const {customerId, payload} = req.body;
  const customer = await stripe.customers.update(
    customerId,
    payload
  );
  res.send({ customer: customer });
}catch(error){
  next(error);
}
});

module.exports = router;