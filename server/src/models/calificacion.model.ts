import { Schema, model, Document } from 'mongoose';

export interface ICalificacion extends Document {
  usuario_id: any;
  videojuego_id: any;
  puntuacion: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const CalificacionSchema = new Schema<ICalificacion>(
  {
    usuario_id: { type: Schema.Types.Mixed, required: true },
    videojuego_id: { type: Schema.Types.Mixed, required: true },
    puntuacion: { type: Number, required: true, min: 1, max: 10 },
  },
  {
    collection: 'ratings',
    timestamps: true,
  }
);

CalificacionSchema.index({ usuario_id: 1, videojuego_id: 1 }, { unique: true });

export const CalificacionModel = model<ICalificacion>('Calificacion', CalificacionSchema);
