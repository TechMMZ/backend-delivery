import pool from '../models/db.js';

export const getMascota = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM mascotas');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener mascotas:', error);
        res.status(500).json({ message: 'Error al obtener mascotas' });
    }
};
