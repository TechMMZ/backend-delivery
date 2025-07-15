import express from 'express';
import { getTecnologia } from '../controllers/tecnologiaController.js';

const router = express.Router();

router.get('/', getTecnologia);

export default router;
