import pool from '../models/db.js';

export const getSliderImages = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM slider_images');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las imágenes' });
    }
};
