import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { VideojuegoModel } from '../models/videojuego.model.js';
import { CompaniaModel } from '../models/compania.model.js';
import { CalificacionModel } from '../models/calificacion.model.js';

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
    const paramId = String(req.params.id).trim();
    let juego: any = null;

    // 1. Si es un ObjectId válido de 24 caracteres hex
    if (mongoose.Types.ObjectId.isValid(paramId) && paramId.length === 24) {
      try {
        juego = await VideojuegoModel.findById(paramId).lean();
      } catch (err) {
        console.warn('findById falló con paramId:', paramId, err);
      }
    }

    // 2. Si no se encontró, buscar por campo numérico 'id'
    if (!juego) {
      const numId = Number(paramId);
      if (!isNaN(numId)) {
        try {
          juego = await VideojuegoModel.findOne({ id: numId }).lean();
        } catch (err) {
          console.warn('findOne({ id }) falló:', err);
        }
      }
    }

    // 3. Fallback directo a la colección nativa de MongoDB para evitar restricciones de casting de Mongoose
    if (!juego) {
      try {
        const orList: any[] = [{ _id: paramId }];
        const numId = Number(paramId);
        if (!isNaN(numId)) {
          orList.push({ id: numId });
        }
        juego = await VideojuegoModel.collection.findOne({ $or: orList });
      } catch (errNative) {
        console.warn('collection.findOne falló:', errNative);
      }
    }

    if (!juego) {
      res.status(404).json({ mensaje: 'Videojuego no encontrado' });
      return;
    }

    // 4. Intentar enriquecer con la compañía asociada de forma segura
    if (juego.compania_id !== undefined && juego.compania_id !== null) {
      try {
        const rawCompId = juego.compania_id;
        const compStr = String(rawCompId).trim();
        let compania = null;

        // Solo buscar por _id si compStr es un ObjectId válido de 24 caracteres hex
        if (mongoose.Types.ObjectId.isValid(compStr) && compStr.length === 24) {
          compania = await CompaniaModel.findById(compStr).lean();
        }

        // Buscar por id numérico
        if (!compania) {
          const compNum = Number(rawCompId);
          if (!isNaN(compNum)) {
            compania = await CompaniaModel.findOne({ id: compNum }).lean();
          }
        }

        // Fallback nativo
        if (!compania) {
          const compNum = Number(rawCompId);
          const compOr: any[] = [{ _id: compStr }];
          if (!isNaN(compNum)) {
            compOr.push({ id: compNum });
          }
          compania = await CompaniaModel.collection.findOne({ $or: compOr });
        }

        if (compania) {
          juego.compania = compania;
        }
      } catch (errComp) {
        console.warn('[getVideojuegoById] No se pudo cargar la compañía asociada:', errComp);
      }
    }

    // 5. Consultar cantidad real de calificaciones de usuarios
    try {
      const jId = String(juego._id);
      const totalRatings = await CalificacionModel.countDocuments({ videojuego_id: jId });
      juego.total_calificaciones = totalRatings;

      const userIdQuery = req.query.usuario_id;
      if (userIdQuery) {
        const miCalif = await CalificacionModel.findOne({
          usuario_id: String(userIdQuery),
          videojuego_id: jId
        }).lean();
        if (miCalif) {
          juego.mi_calificacion = miCalif.puntuacion;
        }
      }
    } catch (eRatings) {
      console.warn('Error al consultar ratings para juego:', eRatings);
    }

    res.json(juego);
  } catch (error) {
    console.error('[getVideojuegoById] Error inesperado:', error);
    res.status(500).json({ mensaje: 'Error al buscar videojuego', error });
  }
};

export const calificarVideojuego = async (req: Request, res: Response): Promise<void> => {
  try {
    const paramId = String(req.params.id).trim();
    const { usuario_id, puntuacion } = req.body;

    const puntos = Number(puntuacion);
    if (isNaN(puntos) || puntos < 1 || puntos > 10) {
      res.status(400).json({ mensaje: 'La calificación debe ser un número entre 1 y 10' });
      return;
    }

    if (!usuario_id) {
      res.status(400).json({ mensaje: 'El ID de usuario es obligatorio para calificar' });
      return;
    }

    // Localizar el juego
    let juego: any = null;
    if (mongoose.Types.ObjectId.isValid(paramId) && paramId.length === 24) {
      juego = await VideojuegoModel.findById(paramId);
    }
    if (!juego) {
      const numId = Number(paramId);
      if (!isNaN(numId)) {
        juego = await VideojuegoModel.findOne({ id: numId });
      }
    }
    if (!juego) {
      res.status(404).json({ mensaje: 'Videojuego no encontrado' });
      return;
    }

    const jId = String(juego._id);
    const uId = String(usuario_id);

    // Guardar o actualizar la calificación del usuario en MongoDB
    await CalificacionModel.findOneAndUpdate(
      { usuario_id: uId, videojuego_id: jId },
      { puntuacion: puntos },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Calcular el nuevo promedio ponderado con todos los usuarios reales
    const todasCalificaciones = await CalificacionModel.find({ videojuego_id: jId });
    const totalUsuarios = todasCalificaciones.length;
    const sumaPuntos = todasCalificaciones.reduce((acc, c) => acc + c.puntuacion, 0);
    const nuevoPromedio = totalUsuarios > 0 ? Number((sumaPuntos / totalUsuarios).toFixed(1)) : puntos;

    // Actualizar score_global y total_calificaciones en el documento de videogames
    juego.score_global = nuevoPromedio;
    juego.total_calificaciones = totalUsuarios;
    await juego.save();

    res.json({
      mensaje: 'Calificación registrada exitosamente',
      score_global: nuevoPromedio,
      total_calificaciones: totalUsuarios,
      mi_calificacion: puntos
    });
  } catch (error) {
    console.error('[calificarVideojuego] Error:', error);
    res.status(500).json({ mensaje: 'Error al registrar calificación', error });
  }
};

export const eliminarCalificacionVideojuego = async (req: Request, res: Response): Promise<void> => {
  try {
    const paramId = String(req.params.id).trim();
    const usuario_id = req.body?.usuario_id || req.query?.usuario_id;

    if (!usuario_id) {
      res.status(400).json({ mensaje: 'El ID de usuario es obligatorio para eliminar la calificación' });
      return;
    }

    // Localizar el juego
    let juego: any = null;
    if (mongoose.Types.ObjectId.isValid(paramId) && paramId.length === 24) {
      juego = await VideojuegoModel.findById(paramId);
    }
    if (!juego) {
      const numId = Number(paramId);
      if (!isNaN(numId)) {
        juego = await VideojuegoModel.findOne({ id: numId });
      }
    }
    if (!juego) {
      res.status(404).json({ mensaje: 'Videojuego no encontrado' });
      return;
    }

    const jId = String(juego._id);
    const uId = String(usuario_id);

    // Eliminar la calificación de este usuario en ratings
    await CalificacionModel.deleteOne({ usuario_id: uId, videojuego_id: jId });

    // Recalcular promedio con los votos reales restantes
    const todasCalificaciones = await CalificacionModel.find({ videojuego_id: jId });
    const totalUsuarios = todasCalificaciones.length;
    const sumaPuntos = todasCalificaciones.reduce((acc, c) => acc + c.puntuacion, 0);
    const nuevoPromedio = totalUsuarios > 0 ? Number((sumaPuntos / totalUsuarios).toFixed(1)) : 0;

    juego.score_global = nuevoPromedio;
    juego.total_calificaciones = totalUsuarios;
    await juego.save();

    res.json({
      mensaje: 'Calificación eliminada correctamente',
      score_global: nuevoPromedio,
      total_calificaciones: totalUsuarios,
      mi_calificacion: null
    });
  } catch (error) {
    console.error('[eliminarCalificacionVideojuego] Error:', error);
    res.status(500).json({ mensaje: 'Error al eliminar calificación', error });
  }
};

export const resetearPlaceholders = async (req: Request, res: Response): Promise<void> => {
  try {
    await sincronizarScoresConRatingsReales();
    res.json({ mensaje: 'Placeholders reseteados correctamente a calificaciones reales.' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al resetear placeholders', error });
  }
};

// Función para sincronizar la colección videogames con los votos reales de ratings
export const sincronizarScoresConRatingsReales = async (): Promise<void> => {
  try {
    const juegos = await VideojuegoModel.find();
    for (const juego of juegos) {
      const jId = String(juego._id);
      const ratings = await CalificacionModel.find({ videojuego_id: jId });
      const count = ratings.length;
      if (count === 0) {
        if (juego.score_global !== 0 || juego.total_calificaciones !== 0) {
          juego.score_global = 0;
          juego.total_calificaciones = 0;
          await juego.save();
        }
      } else {
        const sum = ratings.reduce((acc, c) => acc + c.puntuacion, 0);
        const prom = Number((sum / count).toFixed(1));
        if (juego.score_global !== prom || juego.total_calificaciones !== count) {
          juego.score_global = prom;
          juego.total_calificaciones = count;
          await juego.save();
        }
      }
    }
  } catch (err) {
    console.warn('Advertencia en sincronización de scores:', err);
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
