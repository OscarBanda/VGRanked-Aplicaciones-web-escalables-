import { Router } from 'express';
import {
  getCompanias,
  getCompaniaById,
  createCompania,
  updateCompania,
  deleteCompania,
} from '../controllers/companias.controller.js';

const router = Router();

router.get('/', getCompanias);
router.get('/:id', getCompaniaById);
router.post('/', createCompania);
router.put('/:id', updateCompania);
router.delete('/:id', deleteCompania);

export default router;
