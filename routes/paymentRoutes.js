import express from 'express';
import { createPayment, paymentWebhook } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/', createPayment); // Crear pago
router.post('/webhook', paymentWebhook); // Webhook de Mercado Pago

export default router;
