const {Router} = require('express')
const router = Router();
const customer = require('../Controllers/Customer')
const subscriptor = require('../Controllers/Subscriptor')
const invoicePreview = require('../Controllers/InvoicePreview')
const subscription = require('../Controllers/Subscription')
const price = require('../Controllers/Price');
router.use('/create-customer',customer)
router.use('/create-subscriptor',subscriptor)
//router.use('/invoice-preview',invoicePreview)
router.use('/subscription',subscription)
router.use('/prices',price)

module.exports = router;