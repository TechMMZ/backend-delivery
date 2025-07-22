import { paymentClient } from '../config/mercadopago.js';

import db from '../models/db.js'; // Ajusta a tu conexión real (Supabase o tu DB)

export const createPayment = async (req, res) => {
    try {
        const { token, transaction_amount, description, installments, payment_method_id, payer, order_id } = req.body;

        if (!token || !transaction_amount || !description || !payer?.email || !order_id) {
            return res.status(400).json({ error: 'Faltan datos para procesar el pago' });
        }

        const paymentData = {
            transaction_amount: Number(transaction_amount),
            token,
            description,
            installments: Number(installments) || 1,
            payment_method_id,
            payer: {
                email: payer.email,
                identification: payer.identification || { type: 'DNI', number: '12345678' }
            }
        };

        // Crear pago en Mercado Pago
        const payment = await paymentClient.create({ body: paymentData });
        const paymentId = payment.response.id;
        const paymentStatus = payment.response.status;

        // Guardar el estado del pago en la tabla "orders"
        await db.query(
            'UPDATE orders SET payment_id = $1, payment_status = $2 WHERE id = $3',
            [paymentId, paymentStatus, order_id]
        );

        res.status(200).json({
            message: 'Pago creado correctamente',
            payment_id: paymentId,
            status: paymentStatus
        });
    } catch (error) {
        console.error('Error en createPayment:', error);
        res.status(500).json({ error: error.message });
    }
};

// ✅ Webhook para actualizar estado de pago
export const paymentWebhook = async (req, res) => {
    try {
        const { id, type } = req.query;

        if (type === 'payment') {
            const payment = await paymentClient.get({ id });

            const paymentStatus = payment.status;
            const paymentId = payment.id;

            await db.query(
                'UPDATE orders SET payment_status = $1 WHERE payment_id = $2',
                [paymentStatus, paymentId]
            );

            console.log(`Webhook: pago ${paymentId} actualizado a ${paymentStatus}`);
        }

        res.sendStatus(200);
    } catch (error) {
        console.error('Error en webhook:', error);
        res.sendStatus(500);
    }
};
