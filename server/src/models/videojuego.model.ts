import { Schema, model, Document } from 'mongoose';

export interface IVideojuego extends Document {
  nombre: string;
  genero: string;
  descripcion?: string;
  imagen_cover?: string;
  imagen_portada?: string;
  compania_id?: any;
  score_global: number;
}

const VideojuegoSchema = new Schema<IVideojuego>(
  {
    nombre: { type: String, required: true },
    genero: { type: String, required: true },
    descripcion: { type: String },
    imagen_cover: { type: String },
    imagen_portada: { type: String },
    compania_id: { type: Schema.Types.Mixed },
    score_global: { type: Number, default: 0 },
  },
  {
    collection: 'videogames',
    timestamps: true,
  }
);

export const VideojuegoModel = model<IVideojuego>('Videojuego', VideojuegoSchema);
