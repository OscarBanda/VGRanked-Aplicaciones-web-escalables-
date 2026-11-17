export interface Videojuego {
  _id?: string;
  id?: number;
  nombre: string;
  genero: string;
  descripcion?: string;
  imagen_cover?: string;
  imagen_portada?: string;
  compania_id?: any;
  score_global: number;
  total_calificaciones?: number;
  mi_calificacion?: number;
  compania?: Compania;
  createdAt?: string;
  updatedAt?: string;
}

export interface Consola {
  _id?: string;
  id?: number;
  nombre: string;
  abreviatura?: string;
  informacion_general?: string;
  imagen?: string;
  score_ranking: number;
}

export interface Compania {
  _id?: string;
  id?: number;
  nombre: string;
  informacion_general?: string;
  imagen_logo?: string;
  score_ranking: number;
}

export interface Usuario {
  _id?: string;
  id?: string | number;
  username: string;
  correo: string;
  email?: string;
  foto_perfil?: string;
  rol?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  mensaje: string;
  usuario: Usuario;
}
