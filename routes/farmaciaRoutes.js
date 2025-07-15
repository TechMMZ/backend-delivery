import express from 'express';
import { getFarmacia } from '../controllers/farmaciaController.js';

const router = express.Router();

router.get('/', getFarmacia);

export default router;
