require('dotenv').config();
const db = require("../Firebase");
const {Router} = require('express');
const router = Router();
router.post('/', async (req, res, next) => {
  const { customerId } = req.body;
  const payload = req.body;
  try{
    const subscriptor =await db.collection("Subscriptors").doc(customerId)
    .set(payload);
    res.send(subscriptor);
  }catch(error){
      next(error);
  }
});

module.exports = router;