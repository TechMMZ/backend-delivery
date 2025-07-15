import express from 'express';
import { getMascota } from '../controllers/mascotaController.js';

const router = express.Router();

router.get('/', getMascota);

export default router;

