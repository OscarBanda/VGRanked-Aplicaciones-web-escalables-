export interface Usuario {
  id: number;
  username: string;
  email: string;
  password?: string;
  rol: 'invitado' | 'usuario' | 'administrador';
  descripcion?: string;
  foto_perfil?: string;
}

export interface Compania {
  id: number;
  nombre: string;
  informacion_general: string;
  imagen_logo: string;
  score_ranking: number;
}

export interface Consola {
  id: number;
  nombre: string;
  abreviatura: string;
  informacion_general: string;
  imagen: string;
  score_ranking: number;
}

export interface Videojuego {
  id: number;
  nombre: string;
  genero: string;
  descripcion: string;
  imagen_cover: string;
  imagen_portada: string;
  compania_id: number;
  score_global: number;
}

export interface ConsolaVideojuego {
  id: number;
  videojuego_id: number;
  consola_id: number;
}

export interface Calificacion {
  id: number;
  usuario_id: number;
  videojuego_id: number;
  puntuacion: number;
}

export interface ListaPersonal {
  id: number;
  usuario_id: number;
  videojuego_id: number;
}

export interface Favorito {
  id: number;
  usuario_id: number;
  videojuego_id: number;
}
