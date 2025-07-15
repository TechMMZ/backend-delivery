import pool from '../models/db.js';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// Función para encriptar datos
const encrypt = (text) => {
    const iv = crypto.randomBytes(16);
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'utf8');
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
};

// Función para desencriptar datos
const decrypt = (text) => {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'utf8');
    const encryptedText = textParts.join(':');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

// Crear tarjeta
export const createCard = async (req, res) => {
    try {
        const { user_id, card_type, card_number, card_name, expiry_date, cvv } = req.body;

        if (!user_id || !card_type || !card_number || !card_name || !expiry_date || !cvv) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        const encryptedCardNumber = encrypt(card_number);
        const encryptedExpiryDate = encrypt(expiry_date);
        const encryptedCvv = encrypt(cvv);

        const result = await pool.query(
            'INSERT INTO cards (user_id, card_type, card_number_encrypted, card_name, expiry_date_encrypted, cvv_encrypted) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            [user_id, card_type, encryptedCardNumber, card_name, encryptedExpiryDate, encryptedCvv]
        );

        res.status(201).json({
            id: result.rows[0].id,
            card_type,
            card_name,
            last4: card_number.slice(-4)
        });
    } catch (error) {
        console.error('Error al crear tarjeta:', error);
        res.status(500).json({ error: 'Error al guardar tarjeta', details: error.message });
    }
};

// Obtener tarjetas de un usuario
export const getCards = async (req, res) => {
    try {
        const { userId } = req.params;

        const result = await pool.query(
            'SELECT id, card_type, card_name, card_number_encrypted FROM cards WHERE user_id = $1',
            [userId]
        );

        const formattedCards = result.rows.map(card => ({
            id: card.id,
            card_type: card.card_type,
            card_name: card.card_name,
            last4: decrypt(card.card_number_encrypted).slice(-4)
        }));

        res.json(formattedCards);
    } catch (error) {
        console.error('Error al obtener tarjetas:', error);
        res.status(500).json({ error: 'Error al obtener tarjetas', details: error.message });
    }
};

// Eliminar tarjeta por id
export const deleteCard = async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query('DELETE FROM cards WHERE id = $1', [id]);

        res.json({ message: 'Tarjeta eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar tarjeta:', error);
        res.status(500).json({ error: 'Error al eliminar tarjeta', details: error.message });
    }
};

// Actualizar tarjeta por id
export const updateCard = async (req, res) => {
    try {
        const { id } = req.params;
        const { card_type, card_name } = req.body;

        if (!card_type || !card_name) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        await pool.query(
            'UPDATE cards SET card_type = $1, card_name = $2 WHERE id = $3',
            [card_type, card_name, id]
        );

        res.json({ message: 'Tarjeta actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar tarjeta:', error);
        res.status(500).json({ error: 'Error al actualizar tarjeta', details: error.message });
    }
};
