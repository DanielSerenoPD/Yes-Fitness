require('dotenv').config();
const {PRIVATE} = process.env
const stripe = require("stripe")(PRIVATE)
const db = require("../Firebase");
const preferencesPlans = require("./PreferencesPlans");
const prices = require("./Prices");
class PlansService {
  constructor() {
    this.plans = [];
  }
  async generatePlans() {
    try {
      const plans = await db.collection("paquetesClases").get();
      console.log(plans.size)
      if(!plans.size){
      let planBasic = await stripe.products.create(preferencesPlans.planBasic);
      let planStandard = await stripe.products.create(preferencesPlans.planStandard);
      let planPremium = await stripe.products.create(preferencesPlans.planPremium);
      this.asociatePrices([planBasic, planStandard, planPremium])
      let priceBasic = await stripe.prices.create(prices.priceBasic);
      let priceStandard = await stripe.prices.create(prices.priceStandard);
      let pricePremium = await stripe.prices.create(prices.pricePremium);
      await db.collection("paquetesClases").doc(priceBasic.id).set({price:priceBasic.id, product:planBasic.id, name: preferencesPlans.planBasic.name, classes: 10});
      await db.collection("paquetesClases").doc(priceStandard.id).set({price:priceStandard.id, product:planStandard.id, name:preferencesPlans.planStandard.name, classes: 20});
      await db.collection("paquetesClases").doc(pricePremium.id).set({price:pricePremium.id, product:planPremium.id, name:preferencesPlans.planPremium.name, classes: 30});
    }
    } catch (error) {
      throw new Error(error.message);
    }
  }
  
    asociatePrices(products) {
    prices.priceBasic["product"] = products[0].id;
    prices.priceStandard["product"] = products[1].id;
    prices.pricePremium["product"] = products[2].id;
  }

    
}

module.exports = PlansService;
