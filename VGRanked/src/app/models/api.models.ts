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
