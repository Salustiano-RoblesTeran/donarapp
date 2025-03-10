import { Router } from "express";
import { createOrder, reciveWebhook } from "../controllers/paymentCtrl.js";

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

export default router;
