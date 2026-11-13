import { Schema, model, Document } from 'mongoose';

export interface IConsola extends Document {
  nombre: string;
  abreviatura?: string;
  informacion_general?: string;
  imagen?: string;
  score_ranking: number;
}

const ConsolaSchema = new Schema<IConsola>(
  {
    nombre: { type: String, required: true },
    abreviatura: { type: String },
    informacion_general: { type: String },
    imagen: { type: String },
    score_ranking: { type: Number, default: 0 },
  },
  {
    collection: 'consoles',
    timestamps: true,
  }
);

export const ConsolaModel = model<IConsola>('Consola', ConsolaSchema);
