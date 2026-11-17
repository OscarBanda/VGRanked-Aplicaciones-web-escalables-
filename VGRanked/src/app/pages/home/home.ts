import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card } from '../../components/card/card';
import { ApiService } from '../../services/api.service';
import { Videojuego, Compania } from '../../models/api.models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Card, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  videojuegosRecientes: Videojuego[] = [];
  videojuegosMejorRankeados: Videojuego[] = [];
  companiasDestacadas: Compania[] = [];

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    // Videojuegos
    this.api.getVideojuegos().subscribe({
      next: (juegos) => {
        this.videojuegosRecientes = juegos.slice(0, 3);
        this.videojuegosMejorRankeados = [...juegos]
          .sort((a, b) => (b.score_global || 0) - (a.score_global || 0))
          .slice(0, 4);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando juegos en Home:', err)
    });

    // Compañías
    this.api.getCompanias().subscribe({
      next: (companias) => {
        this.companiasDestacadas = [...companias]
          .sort((a, b) => (b.score_ranking || 0) - (a.score_ranking || 0))
          .slice(0, 4);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando compañías en Home:', err)
    });
  }
}
