require('dotenv').config();
const {PRIVATE} = process.env
const express = require('express');
const routes = require("./Routes");
const cors = require('cors');
const errorHandler = require('./Utils/Middlewares/ErrorHandler.js')
const PlansService = require("./Services/Plans");
const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  //url donde almacenas el cliente
  origin: '*',
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));
async function seeders() {
  await new PlansService().generatePlans();
}
seeders();
app.use('/',cors(),routes)
app.use(errorHandler)
module.exports = app