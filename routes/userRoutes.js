import express from 'express';
import {
    registerUser,
    loginUser,
    updateUserProfile,
    getUserById,
    verifyTokenAndGetUser,
    uploadUserPhoto,
    upload
} from '../controllers/userController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// Registro y login
router.post('/register', registerUser);
router.post('/login', loginUser);

// Verificación de token
router.get('/verifyToken', verifyToken, verifyTokenAndGetUser);

// Obtener perfil por ID (protegido)
router.get('/:id', verifyToken, getUserById);

// Actualizar perfil de usuario (protegido)
router.put('/:id', verifyToken, updateUserProfile);

// Subir foto de perfil (protegido)
router.post('/:id/photo', verifyToken, upload.single('photo'), uploadUserPhoto);

export default router;
