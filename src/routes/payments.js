const { Router } = require("express");
const { createDonation, reciveWebhook, getUser, dashboard, transaction } = require("../controllers/paymentCtrl.js");

const { validateJWT } = require("../middlewares/validate_jwt.js")

const router = Router();

router.post('/donate', createDonation);

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

router.get('/user/:id', getUser)

router.get('/dashboard', validateJWT, dashboard)

router.get('/transaction', transaction)

module.exports = router;
