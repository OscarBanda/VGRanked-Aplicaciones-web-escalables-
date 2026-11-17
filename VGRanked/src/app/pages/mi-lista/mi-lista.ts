import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Card } from '../../components/card/card';
import { LibraryHeader } from '../../components/library-header/library-header';
import { ApiService } from '../../services/api.service';
import { Videojuego } from '../../models/api.models';

export interface VideojuegoConCalificacion extends Videojuego {
  miCalificacion?: number | null;
}

@Component({
  selector: 'app-mi-lista',
  standalone: true,
  imports: [CommonModule, RouterLink, Card, LibraryHeader],
  templateUrl: './mi-lista.html',
  styleUrl: './mi-lista.css',
})
export class MiLista implements OnInit {
  protected readonly api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  cargando = true;
  juegosEnLista: VideojuegoConCalificacion[] = [];
  mensajeFeedback: string | null = null;

  ngOnInit(): void {
    this.cargarLista();
  }

  cargarLista(): void {
    this.cargando = true;

    if (!this.api.estaAutenticado()) {
      this.cargando = false;
      this.juegosEnLista = [];
      this.cdr.detectChanges();
      return;
    }

    const idsEnLista = this.api.getListaUsuario();

    this.api.getVideojuegos().subscribe({
      next: (todosLosJuegos) => {
        this.juegosEnLista = todosLosJuegos
          .filter(j => {
            const jId = String(j._id || j.id);
            return idsEnLista.includes(jId);
          })
          .map(j => {
            const jId = String(j._id || j.id);
            const calif = this.api.getCalificacionUsuario(jId);
            return {
              ...j,
              miCalificacion: calif
            };
          });

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar videojuegos de la lista:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  quitarDeLista(juego: VideojuegoConCalificacion, event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    const jId = String(juego._id || juego.id);
    this.api.toggleListaUsuario(jId);

    // Actualizar lista local
    this.juegosEnLista = this.juegosEnLista.filter(j => String(j._id || j.id) !== jId);

    this.mostrarFeedback(`"${juego.nombre}" ha sido eliminado de tu lista`);
    this.cdr.detectChanges();
  }

  mostrarFeedback(mensaje: string): void {
    this.mensajeFeedback = mensaje;
    setTimeout(() => {
      this.mensajeFeedback = null;
      this.cdr.detectChanges();
    }, 3000);
  }
}
