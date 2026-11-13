import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Card } from '../../components/card/card';
import { LibraryHeader } from '../../components/library-header/library-header';
import { FilterBar } from '../../components/filter-bar/filter-bar';
import { ApiService } from '../../services/api.service';
import { Consola } from '../../models/api.models';

@Component({
  selector: 'app-consolas',
  imports: [Card, LibraryHeader, FilterBar],
  templateUrl: './consolas.html',
  styleUrl: './consolas.css',
})
export class Consolas implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  busqueda = '';
  ordenSeleccionado = 'nombre';
  cargando = true;

  consolas: Consola[] = [];

  ngOnInit(): void {
    this.cargarConsolas();
  }

  cargarConsolas(): void {
    console.log('[Consolas] Iniciando petición a la API...');
    this.cargando = true;
    this.api.getConsolas().subscribe({
      next: (data) => {
        console.log('[Consolas] Datos recibidos de MongoDB:', data);
        this.consolas = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[Consolas] Error al cargar consolas de MongoDB:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  get consolasFiltradas(): Consola[] {
    const texto = this.busqueda.toLowerCase().trim();

    const resultado = this.consolas.filter(consola => {
      const coincideNombre = consola.nombre ? consola.nombre.toLowerCase().includes(texto) : false;
      const coincideAbrev = consola.abreviatura ? consola.abreviatura.toLowerCase().includes(texto) : false;
      return coincideNombre || coincideAbrev;
    });

    return [...resultado].sort((a, b) => {
      const scoreA = a.score_ranking || 0;
      const scoreB = b.score_ranking || 0;

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
