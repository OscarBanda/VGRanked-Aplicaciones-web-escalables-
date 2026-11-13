import { Request, Response } from 'express';
import { CompaniaModel } from '../models/compania.model.js';

export const getCompanias = async (req: Request, res: Response): Promise<void> => {
  try {
    const companias = await CompaniaModel.find();
    res.json(companias);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener compañías', error });
  }
};

export const getCompaniaById = async (req: Request, res: Response): Promise<void> => {
  try {
    const compania = await CompaniaModel.findById(req.params.id);
    if (!compania) {
      res.status(404).json({ mensaje: 'Compañía no encontrada' });
      return;
    }
    res.json(compania);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar compañía', error });
  }
};

export const createCompania = async (req: Request, res: Response): Promise<void> => {
  try {
    const nuevaCompania = new CompaniaModel(req.body);
    const guardada = await nuevaCompania.save();
    res.status(201).json(guardada);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear compañía', error });
  }
};

export const updateCompania = async (req: Request, res: Response): Promise<void> => {
  try {
    const actualizada = await CompaniaModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizada) {
      res.status(404).json({ mensaje: 'Compañía no encontrada' });
      return;
    }
    res.json(actualizada);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar compañía', error });
  }
};

export const deleteCompania = async (req: Request, res: Response): Promise<void> => {
  try {
    const eliminada = await CompaniaModel.findByIdAndDelete(req.params.id);
    if (!eliminada) {
      res.status(404).json({ mensaje: 'Compañía no encontrada' });
      return;
    }
    res.json({ mensaje: 'Compañía eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar compañía', error });
  }
};
