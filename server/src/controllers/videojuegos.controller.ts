import { Request, Response } from 'express';
import { VideojuegoModel } from '../models/videojuego.model.js';

export const getVideojuegos = async (req: Request, res: Response): Promise<void> => {
  try {
    const videojuegos = await VideojuegoModel.find();
    res.json(videojuegos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener videojuegos', error });
  }
};

export const getVideojuegoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const juego = await VideojuegoModel.findById(req.params.id);
    if (!juego) {
      res.status(404).json({ mensaje: 'Videojuego no encontrado' });
      return;
    }
    res.json(juego);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar videojuego', error });
  }
};

export const createVideojuego = async (req: Request, res: Response): Promise<void> => {
  try {
    const nuevoJuego = new VideojuegoModel(req.body);
    const guardado = await nuevoJuego.save();
    res.status(201).json(guardado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear videojuego', error });
  }
};

export const updateVideojuego = async (req: Request, res: Response): Promise<void> => {
  try {
    const actualizado = await VideojuegoModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizado) {
      res.status(404).json({ mensaje: 'Videojuego no encontrado' });
      return;
    }
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar videojuego', error });
  }
};

export const deleteVideojuego = async (req: Request, res: Response): Promise<void> => {
  try {
    const eliminado = await VideojuegoModel.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      res.status(404).json({ mensaje: 'Videojuego no encontrado' });
      return;
    }
    res.json({ mensaje: 'Videojuego eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar videojuego', error });
  }
};
