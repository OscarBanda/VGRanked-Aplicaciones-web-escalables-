import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  correo: string;
  password: string;
  foto_perfil?: string;
  rol: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'El nombre de usuario es obligatorio'],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    correo: {
      type: String,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
    },
    foto_perfil: {
      type: String,
      default: '',
    },
    rol: {
      type: String,
      default: 'usuario',
    },
  },
  {
    collection: 'users',
    timestamps: true,
  }
);

// Sincronizar email y correo automáticamente antes de guardar
UserSchema.pre('save', function () {
  if (this.correo && !this.email) {
    this.email = this.correo;
  } else if (this.email && !this.correo) {
    this.correo = this.email;
  }
});

export const UserModel = model<IUser>('User', UserSchema);
