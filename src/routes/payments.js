const { Router } = require("express");
const { createDonation, reciveWebhook, getTransaction } = require("../controllers/paymentCtrl.js");

const { validateJWT } = require("../middlewares/validate_jwt.js")

const router = Router();

router.post('/donate', createDonation);

router.get('/success', (req, res) => {
    res.redirect('http://localhost:5173/success')
});

router.get('/failure', (req, res) => {
    res.send('Payment failure');
});

router.get('/pending', (req, res) => {
    res.send('Payment pending');
});

router.post('/webhook', reciveWebhook);

router.get('/transaction/:foundationId', getTransaction)

module.exports = router;
