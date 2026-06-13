import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// dotenv.config() debe correr ANTES de importar cualquier módulo
// que lea process.env, porque con ES Modules los imports se evalúan
// en el momento de carga, antes de que el código del módulo padre ejecute.
dotenv.config();

// Chequeo de variables de entorno críticas — acá, después de dotenv, antes de todo lo demás
if (!process.env.JWT_SECRET) {
    console.error('FATAL: JWT_SECRET no está definido en .env. Revisá que el archivo exista en /backend/.env');
    process.exit(1);
}
if (!process.env.MONGO_URI) {
    console.error('FATAL: MONGO_URI no está definido en .env');
    process.exit(1);
}

import connectDB from './config/db.js';
import vinoRoutes from './routes/vinoRoutes.js';
import userRoutes from './routes/userRouter.js';
import orderRoutes from './routes/orderRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB(process.env.MONGO_URI);

app.use('/api/vinos', vinoRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ventas', orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));