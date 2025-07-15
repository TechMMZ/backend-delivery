import pool from '../models/db.js';

export const getFarmacia = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM farmacia');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener farmacia:', error);
        res.status(500).json({ message: 'Error al obtener farmacia' });
    }
};
