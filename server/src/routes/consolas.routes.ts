import { Router } from 'express';
import {
  getConsolas,
  getConsolaById,
  createConsola,
  updateConsola,
  deleteConsola,
} from '../controllers/consolas.controller.js';

const router = Router();

router.get('/', getConsolas);
router.get('/:id', getConsolaById);
router.post('/', createConsola);
router.put('/:id', updateConsola);
router.delete('/:id', deleteConsola);

export default router;
