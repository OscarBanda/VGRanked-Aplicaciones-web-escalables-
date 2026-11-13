import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Card } from '../../components/card/card';
import { LibraryHeader } from '../../components/library-header/library-header';
import { FilterBar } from '../../components/filter-bar/filter-bar';
import { ApiService } from '../../services/api.service';
import { Videojuego } from '../../models/api.models';

@Component({
  selector: 'app-videojuegos',
  standalone: true,
  imports: [Card, LibraryHeader, FilterBar],
  templateUrl: './videojuegos.html',
  styleUrl: './videojuegos.css'
})
export class Videojuegos implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  busqueda = '';
  generoSeleccionado = 'Todos';
  ordenSeleccionado = 'nombre';
  cargando = true;

  videojuegos: Videojuego[] = [];

  ngOnInit(): void {
    this.cargarVideojuegos();
  }

  cargarVideojuegos(): void {
    console.log('[Videojuegos] Iniciando petición a la API...');
    this.cargando = true;
    this.api.getVideojuegos().subscribe({
      next: (data) => {
        console.log('[Videojuegos] Datos recibidos de MongoDB:', data);
        this.videojuegos = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[Videojuegos] Error al cargar videojuegos de MongoDB:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  get generos(): string[] {
    return [
      'Todos',
      ...new Set(this.videojuegos.map(juego => juego.genero).filter(Boolean))
    ];
  }

  get videojuegosFiltrados(): Videojuego[] {
    const texto = this.busqueda.toLowerCase().trim();

    const resultado = this.videojuegos.filter(juego => {
      const coincideNombre = juego.nombre ? juego.nombre.toLowerCase().includes(texto) : false;
      const coincideGenero =
        this.generoSeleccionado === 'Todos' ||
        juego.genero === this.generoSeleccionado;

      return coincideNombre && coincideGenero;
    });

    return [...resultado].sort((a, b) => {
      const scoreA = a.score_global || 0;
      const scoreB = b.score_global || 0;

      if (this.ordenSeleccionado === 'score-desc') {
        return scoreB - scoreA;
      }

      if (this.ordenSeleccionado === 'score-asc') {
        return scoreA - scoreB;
      }

      return (a.nombre || '').localeCompare(b.nombre || '');
    });
  }
}
