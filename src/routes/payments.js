const { Router } = require("express");
const { createOrder, reciveWebhook } = require("../controllers/paymentCtrl.js");

const router = Router();

router.post('/create-order', createOrder);

router.get('/success', (req, res) => {
    res.send('Payment success');
});

router.get('/failure', (req, res) => {
    res.send('Payment failure');
});

router.get('/pending', (req, res) => {
    res.send('Payment pending');
});

router.post('/webhook', reciveWebhook); 

// Usar module.exports en lugar de export default
module.exports = router;
