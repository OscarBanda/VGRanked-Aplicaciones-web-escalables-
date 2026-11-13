import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Videojuego, Consola, Compania } from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api';

  // Videojuegos
  getVideojuegos(): Observable<Videojuego[]> {
    return this.http.get<Videojuego[]>(`${this.baseUrl}/videojuegos`);
  }

  getVideojuego(id: string): Observable<Videojuego> {
    return this.http.get<Videojuego>(`${this.baseUrl}/videojuegos/${id}`);
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
