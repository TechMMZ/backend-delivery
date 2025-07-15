import pool from '../models/db.js';

export const getProducts = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM food');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ message: 'Error al obtener los productos' });
    }
};
