import { Request, Response } from 'express';
import { ConsolaModel } from '../models/consola.model.js';

export const getConsolas = async (req: Request, res: Response): Promise<void> => {
  try {
    const consolas = await ConsolaModel.find();
    res.json(consolas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener consolas', error });
  }
};

export const getConsolaById = async (req: Request, res: Response): Promise<void> => {
  try {
    const consola = await ConsolaModel.findById(req.params.id);
    if (!consola) {
      res.status(404).json({ mensaje: 'Consola no encontrada' });
      return;
    }
    res.json(consola);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar consola', error });
  }
};

export const createConsola = async (req: Request, res: Response): Promise<void> => {
  try {
    const nuevaConsola = new ConsolaModel(req.body);
    const guardada = await nuevaConsola.save();
    res.status(201).json(guardada);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear consola', error });
  }
};

export const updateConsola = async (req: Request, res: Response): Promise<void> => {
  try {
    const actualizada = await ConsolaModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizada) {
      res.status(404).json({ mensaje: 'Consola no encontrada' });
      return;
    }
    res.json(actualizada);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar consola', error });
  }
};

export const deleteConsola = async (req: Request, res: Response): Promise<void> => {
  try {
    const eliminada = await ConsolaModel.findByIdAndDelete(req.params.id);
    if (!eliminada) {
      res.status(404).json({ mensaje: 'Consola no encontrada' });
      return;
    }
    res.json({ mensaje: 'Consola eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar consola', error });
  }
};
