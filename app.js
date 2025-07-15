import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import sliderRoutes from './routes/sliderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import comidaRoutes from './routes/comidaRoutes.js';
import tecnologiaRoutes from './routes/tecnologiaRoutes.js';
import farmaciaRoutes from './routes/farmaciaRoutes.js';
import mascotaRoutes from './routes/mascotaRoutes.js';
import cardsRoutes from './routes/cardsRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
// import chatbotRoutes from './routes/chatbotRoutes.js';

dotenv.config();

const app = express();

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir archivos estáticos de la carpeta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Servir archivos estáticos de la carpeta 'public'
app.use('/img', express.static(path.join(__dirname, 'public/img')));

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 7000;

app.get('/', (req, res) => {
    res.send('API de Delivery funcionando 🚀');
});

app.use('/api', sliderRoutes);
app.use('/api/comida', comidaRoutes);
app.use('/api/tecnologia', tecnologiaRoutes);
app.use('/api/farmacia', farmaciaRoutes);
app.use('/api/mascota', mascotaRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cards', cardsRoutes);
app.use('/api/orders', orderRoutes);
// app.use('/api/chats', chatbotRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
}).on('error', (err) => {
    console.error('Error en servidor:', err);
});

