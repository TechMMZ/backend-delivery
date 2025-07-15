import jwt from 'jsonwebtoken';
import db from '../models/db.js';

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token requerido" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const result = await db.query(
            "SELECT id, displayname, email, phone, address, dni, photo_url FROM users WHERE id = $1",
            [decoded.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        req.user = result.rows[0];  // ← guarda usuario completo en request
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Token inválido", error });
    }
};

export default verifyToken;
