require("dotenv-json")();
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const key = require('../../yes-fitness.json');
initializeApp({
    credential:cert(key)
});
// initializeApp({
//     credential:cert(process.env)
// });
const db = getFirestore();
module.exports = db;