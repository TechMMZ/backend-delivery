import pool from '../models/db.js';

export const getTecnologia = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tecnologia');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener tecnología:', error);
        res.status(500).json({ message: 'Error al obtener tecnología' });
    }
};
