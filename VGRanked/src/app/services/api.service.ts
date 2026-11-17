import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Videojuego, Consola, Compania, Usuario, AuthResponse } from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api';

  // Estado de usuario actual reactivo
  usuarioActual = signal<Usuario | null>(this.obtenerUsuarioDeStorage());

  // Autenticación
  registro(datos: { username: string; correo: string; password: string; foto_perfil?: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/registro`, datos).pipe(
      tap((resp) => {
        if (resp && resp.usuario) {
          this.guardarSesion(resp.usuario);
        }
      })
    );
  }

  login(credenciales: { correo: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, credenciales).pipe(
      tap((resp) => {
        if (resp && resp.usuario) {
          this.guardarSesion(resp.usuario);
        }
      })
    );
  }

  guardarSesion(usuario: Usuario): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('currentUser', JSON.stringify(usuario));
      localStorage.setItem('usuario', JSON.stringify(usuario));
    }
    this.usuarioActual.set(usuario);
  }

  cerrarSesion(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('usuario');
    }
    this.usuarioActual.set(null);
  }

  estaAutenticado(): boolean {
    return !!this.usuarioActual();
  }

  getUserIdActual(): string {
    const user = this.usuarioActual();
    return String(user?._id || user?.id || user?.username || 'invitado');
  }

  // Lista personal del usuario
  getListaUsuario(userId?: string): string[] {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const uid = userId || this.getUserIdActual();
    try {
      const stored = localStorage.getItem(`vgranked_list_${uid}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  toggleListaUsuario(juegoId: string, userId?: string): boolean {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const uid = userId || this.getUserIdActual();
    let lista = this.getListaUsuario(uid);
    let agregado = false;

    if (lista.includes(juegoId)) {
      lista = lista.filter(id => id !== juegoId);
      agregado = false;
    } else {
      lista.push(juegoId);
      agregado = true;
    }

    localStorage.setItem(`vgranked_list_${uid}`, JSON.stringify(lista));
    return agregado;
  }

  estaEnLista(juegoId: string, userId?: string): boolean {
    const lista = this.getListaUsuario(userId);
    return lista.includes(juegoId);
  }

  // Calificaciones del usuario
  getCalificacionUsuario(juegoId: string, userId?: string): number | null {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const uid = userId || this.getUserIdActual();
    const stored = localStorage.getItem(`vgranked_rating_${uid}_${juegoId}`);
    return stored ? Number(stored) : null;
  }

  guardarCalificacionUsuario(juegoId: string, score: number, userId?: string): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const uid = userId || this.getUserIdActual();
    localStorage.setItem(`vgranked_rating_${uid}_${juegoId}`, String(score));
  }

  private obtenerUsuarioDeStorage(): Usuario | null {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    try {
      const stored = localStorage.getItem('currentUser') || localStorage.getItem('usuario');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      return null;
    }
    return null;
  }

  // Videojuegos
  getVideojuegos(): Observable<Videojuego[]> {
    return this.http.get<Videojuego[]>(`${this.baseUrl}/videojuegos`);
  }

  getVideojuego(id: string, usuarioId?: string): Observable<Videojuego> {
    const uId = usuarioId || (this.estaAutenticado() ? this.getUserIdActual() : undefined);
    const query = uId ? `?usuario_id=${encodeURIComponent(uId)}` : '';
    return this.http.get<Videojuego>(`${this.baseUrl}/videojuegos/${id}${query}`);
  }

  calificarVideojuego(juegoId: string, puntuacion: number, usuarioId?: string): Observable<{
    mensaje: string;
    score_global: number;
    total_calificaciones: number;
    mi_calificacion: number;
  }> {
    const uId = usuarioId || this.getUserIdActual();
    return this.http.post<{
      mensaje: string;
      score_global: number;
      total_calificaciones: number;
      mi_calificacion: number;
    }>(`${this.baseUrl}/videojuegos/${juegoId}/calificar`, {
      usuario_id: uId,
      puntuacion
    }).pipe(
      tap((res) => {
        if (res) {
          this.guardarCalificacionUsuario(juegoId, puntuacion, uId);
        }
      })
    );
  }

  eliminarCalificacion(juegoId: string, usuarioId?: string): Observable<{
    mensaje: string;
    score_global: number;
    total_calificaciones: number;
    mi_calificacion: null;
  }> {
    const uId = usuarioId || this.getUserIdActual();
    return this.http.request<{
      mensaje: string;
      score_global: number;
      total_calificaciones: number;
      mi_calificacion: null;
    }>('delete', `${this.baseUrl}/videojuegos/${juegoId}/calificar`, {
      body: { usuario_id: uId }
    }).pipe(
      tap(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.removeItem(`vgranked_rating_${uId}_${juegoId}`);
        }
      })
    );
  }

  // Consolas
  getConsolas(): Observable<Consola[]> {
    return this.http.get<Consola[]>(`${this.baseUrl}/consolas`);
  }

  getConsola(id: string): Observable<Consola> {
    return this.http.get<Consola>(`${this.baseUrl}/consolas/${id}`);
  }

  // Compañías
  getCompanias(): Observable<Compania[]> {
    return this.http.get<Compania[]>(`${this.baseUrl}/companias`);
  }

  getCompania(id: string): Observable<Compania> {
    return this.http.get<Compania>(`${this.baseUrl}/companias/${id}`);
  }
}
