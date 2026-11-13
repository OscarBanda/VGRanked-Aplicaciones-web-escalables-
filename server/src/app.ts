import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';

import videojuegosRoutes from './routes/videojuegos.routes.js';
import consolasRoutes from './routes/consolas.routes.js';
import companiasRoutes from './routes/companias.routes.js';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas API
app.use('/api/videojuegos', videojuegosRoutes);
app.use('/api/consolas', consolasRoutes);
app.use('/api/companias', companiasRoutes);

// Ruta base
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API de VGRanked conectada a MongoDB funcionando 🚀' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

export default app;
