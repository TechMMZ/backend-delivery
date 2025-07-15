import express from 'express';

import {
    createOrder,
    getOrdersByUser,
    getOrderById,
    archiveOrder,
    getArchivedOrdersByUser
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/user/:userId', getOrdersByUser);
router.get('/:id', getOrderById);
router.patch('/:id/archive', archiveOrder);
router.get('/user/:userId/archived', getArchivedOrdersByUser);

export default router;
