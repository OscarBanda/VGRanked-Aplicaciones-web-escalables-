import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Card } from '../../components/card/card';
import { LibraryHeader } from '../../components/library-header/library-header';
import { FilterBar } from '../../components/filter-bar/filter-bar';
import { ApiService } from '../../services/api.service';
import { Compania } from '../../models/api.models';

@Component({
  selector: 'app-companias',
  imports: [Card, LibraryHeader, FilterBar],
  templateUrl: './companias.html',
  styleUrl: './companias.css',
})
export class Companias implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  busqueda = '';
  ordenSeleccionado = 'nombre';
  cargando = true;

  companias: Compania[] = [];

  ngOnInit(): void {
    this.cargarCompanias();
  }

  cargarCompanias(): void {
    console.log('[Companias] Iniciando petición a la API...');
    this.cargando = true;
    this.api.getCompanias().subscribe({
      next: (data) => {
        console.log('[Companias] Datos recibidos de MongoDB:', data);
        this.companias = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[Companias] Error al cargar compañías de MongoDB:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  get companiasFiltradas(): Compania[] {
    const texto = this.busqueda.toLowerCase().trim();

    const resultado = this.companias.filter(compania => {
      const coincideNombre = compania.nombre ? compania.nombre.toLowerCase().includes(texto) : false;
      const coincideInfo = compania.informacion_general ? compania.informacion_general.toLowerCase().includes(texto) : false;
      return coincideNombre || coincideInfo;
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
