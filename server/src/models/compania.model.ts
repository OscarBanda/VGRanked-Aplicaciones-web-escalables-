import { Schema, model, Document } from 'mongoose';

export interface ICompania extends Document {
  nombre: string;
  informacion_general?: string;
  imagen_logo?: string;
  score_ranking: number;
}

const CompaniaSchema = new Schema<ICompania>(
  {
    nombre: { type: String, required: true },
    informacion_general: { type: String },
    imagen_logo: { type: String },
    score_ranking: { type: Number, default: 0 },
  },
  {
    collection: 'companies',
    timestamps: true,
  }
);

export const CompaniaModel = model<ICompania>('Compania', CompaniaSchema);
