import { Router } from 'express';
import {
  getVideojuegos,
  getVideojuegoById,
  calificarVideojuego,
  eliminarCalificacionVideojuego,
  resetearPlaceholders,
  createVideojuego,
  updateVideojuego,
  deleteVideojuego,
} from '../controllers/videojuegos.controller.js';

const router = Router();

router.get('/', getVideojuegos);
router.post('/reset-placeholders', resetearPlaceholders);
router.get('/:id', getVideojuegoById);
router.post('/:id/calificar', calificarVideojuego);
router.delete('/:id/calificar', eliminarCalificacionVideojuego);
router.post('/', createVideojuego);
router.put('/:id', updateVideojuego);
router.delete('/:id', deleteVideojuego);

export default router;
