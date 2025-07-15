import express from 'express';
import { getSliderImages } from '../controllers/sliderController.js';

const router = express.Router();

router.get('/slider', getSliderImages);

export default router;
