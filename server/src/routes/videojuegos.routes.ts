import { Router } from 'express';
import {
  getVideojuegos,
  getVideojuegoById,
  createVideojuego,
  updateVideojuego,
  deleteVideojuego,
} from '../controllers/videojuegos.controller.js';

const router = Router();

router.get('/', getVideojuegos);
router.get('/:id', getVideojuegoById);
router.post('/', createVideojuego);
router.put('/:id', updateVideojuego);
router.delete('/:id', deleteVideojuego);

export default router;
