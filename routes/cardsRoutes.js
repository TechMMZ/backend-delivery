import express from 'express';
import { createCard, getCards, deleteCard, updateCard } from '../controllers/cardsController.js';

const router = express.Router();

router.post('/', createCard);
router.get('/:userId', getCards);
router.delete('/:id', deleteCard);
router.put('/:id', updateCard); // 👈 nueva ruta

export default router;
