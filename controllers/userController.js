import db from '../models/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Registro de usuario
export const registerUser = async (req, res) => {
    const { displayname, email, password, photo_url } = req.body;

    try {
        const result = await db.query('SELECT id FROM users WHERE email = $1', [email]);
        if (result.rows.length > 0) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            `INSERT INTO users (displayname, email, password_hash, photo_url, createdAt) 
             VALUES ($1, $2, $3, $4, $5)`,
            [displayname, email, hashedPassword, photo_url, new Date()]
        );

        res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar usuario', error });
    }
};

// Login de usuario
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await db.query(
            'SELECT id, displayname, email, password_hash, photo_url FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign(
            { userId: user.id, displayname: user.displayname },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(200).json({
            message: 'Login exitoso',
            token,
            user: {
                id: user.id,
                displayname: user.displayname,
                email: user.email,
                photo_url: user.photo_url
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión', error });
    }
};

// Actualizar perfil de usuario
export const updateUserProfile = async (req, res) => {
    const { id } = req.params;
    if (req.user.id !== Number(id)) {
        return res.status(403).json({ message: "No autorizado" });
    }
    const { displayname, phone, address, dni, photo_url } = req.body;

    try {
        await db.query(
            'UPDATE users SET displayname = $1, phone = $2, address = $3, dni = $4, photo_url = $5 WHERE id = $6',
            [displayname, phone, address, dni, photo_url, id]
        );

        const result = await db.query(
            'SELECT id, displayname, email, phone, address, dni, photo_url FROM users WHERE id = $1',
            [id]
        );

        res.status(200).json({ message: 'Perfil actualizado correctamente', user: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar perfil', error });
    }
};

// Obtener perfil de usuario por ID
export const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query(
            'SELECT id, displayname, email, phone, address, dni, photo_url FROM users WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ user: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuario', error });
    }
};

export const verifyTokenAndGetUser = (req, res) => {
    res.status(200).json({ user: req.user });
};

// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/users');
    },
    filename: (req, file, cb) => {
        const userId = req.params.id;
        const ext = path.extname(file.originalname);
        const directory = 'uploads/users';
        const filename = `user-${userId}${ext}`;

        const files = fs.readdirSync(directory);
        files.forEach(f => {
            if (f.startsWith(`user-${userId}`)) {
                fs.unlinkSync(path.join(directory, f));
            }
        });

        cb(null, filename);
    }
});

export const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error("Solo se permiten imágenes en formato jpeg, jpg, png o webp"));
        }
    },
    limits: { fileSize: 2 * 1024 * 1024 }
});

// Subir foto de perfil
export const uploadUserPhoto = async (req, res) => {
    const { id } = req.params;
    const photo = req.file;

    if (!photo) {
        return res.status(400).json({ message: 'No se envió ninguna imagen.' });
    }

    try {
        const photoURL = `/uploads/users/${photo.filename}`;

        await db.query('UPDATE users SET photo_url = $1 WHERE id = $2', [photoURL, id]);

        const result = await db.query(
            'SELECT id, displayname, email, phone, address, dni, photo_url FROM users WHERE id = $1',
            [id]
        );

        res.status(200).json({ message: 'Foto actualizada correctamente', user: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar foto', error });
    }
};
