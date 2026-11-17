import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Videojuego, Compania } from '../../models/api.models';

@Component({
  selector: 'app-videojuego-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './videojuego-detalle.html',
  styleUrl: './videojuego-detalle.css'
})
export class VideojuegoDetalle implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  juego: Videojuego | null = null;
  compania: Compania | null = null;
  cargando = true;
  error: string | null = null;

  // Estados de usuario
  enMiLista = false;
  calificacionUsuario: number | null = null;
  mostrarCalificador = false;
  mensajeAccion: string | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.cargarVideojuego(id);
      } else {
        this.error = 'No se proporcionó un ID de videojuego.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  get tieneSesion(): boolean {
    return this.api.estaAutenticado();
  }

  cargarVideojuego(id: string): void {
    this.cargando = true;
    this.error = null;

    this.api.getVideojuego(id).subscribe({
      next: (data) => {
        this.juego = data;
        this.cargando = false;

        this.verificarEstadoUsuario(id);
        if (data.mi_calificacion) {
          this.calificacionUsuario = data.mi_calificacion;
        }

        // Si ya incluye la compañía en la respuesta
        if (data.compania) {
          this.compania = data.compania;
        } else if (data.compania_id) {
          this.cargarCompania(String(data.compania_id));
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[VideojuegoDetalle] Error al obtener el juego:', err);
        this.error = 'No se pudo encontrar el videojuego solicitado.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  cargarCompania(companiaId: string): void {
    this.api.getCompania(companiaId).subscribe({
      next: (comp) => {
        this.compania = comp;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.warn('[VideojuegoDetalle] No se pudo obtener la información de la compañía:', err);
      }
    });
  }

  verificarEstadoUsuario(juegoId: string): void {
    if (!this.tieneSesion) return;
    this.enMiLista = this.api.estaEnLista(juegoId);
    this.calificacionUsuario = this.api.getCalificacionUsuario(juegoId);
  }

  toggleLista(): void {
    if (!this.tieneSesion || !this.juego) return;

    const juegoId = String(this.juego._id || this.juego.id);
    const agregado = this.api.toggleListaUsuario(juegoId);
    this.enMiLista = agregado;

    if (agregado) {
      this.mostrarMensajeTemporal('Videojuego guardado en tu lista personal');
    } else {
      this.mostrarMensajeTemporal('Videojuego eliminado de tu lista');
    }
    this.cdr.detectChanges();
  }

  toggleCalificador(): void {
    if (!this.tieneSesion) return;
    this.mostrarCalificador = !this.mostrarCalificador;
  }

  guardarCalificacion(puntos: number): void {
    if (!this.tieneSesion || !this.juego) return;

    const juegoId = String(this.juego._id || this.juego.id);
    this.calificacionUsuario = puntos;
    this.mostrarCalificador = false;

    this.api.calificarVideojuego(juegoId, puntos).subscribe({
      next: (res) => {
        if (this.juego) {
          this.juego.score_global = res.score_global;
          this.juego.total_calificaciones = res.total_calificaciones;
        }
        this.mostrarMensajeTemporal(`¡Calificación registrada! Has calificado este juego con un ${puntos}/10. Nuevo score global: ${res.score_global}/10`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al calificar videojuego:', err);
        this.mostrarMensajeTemporal(`Tu calificación de ${puntos}/10 se guardó en tu perfil.`);
        this.cdr.detectChanges();
      }
    });
  }

  quitarCalificacion(): void {
    if (!this.tieneSesion || !this.juego) return;

    const juegoId = String(this.juego._id || this.juego.id);
    this.api.eliminarCalificacion(juegoId).subscribe({
      next: (res) => {
        this.calificacionUsuario = null;
        if (this.juego) {
          this.juego.score_global = res.score_global;
          this.juego.total_calificaciones = res.total_calificaciones;
        }
        this.mostrarCalificador = false;
        this.mostrarMensajeTemporal('Has quitado tu calificación para este videojuego.');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al quitar calificación:', err);
        this.calificacionUsuario = null;
        this.mostrarCalificador = false;
        this.mostrarMensajeTemporal('Calificación removida de tu perfil.');
        this.cdr.detectChanges();
      }
    });
  }

  get estaSinCalificar(): boolean {
    if (!this.juego) return true;
    if (this.juego.total_calificaciones !== undefined && this.juego.total_calificaciones !== null) {
      return this.juego.total_calificaciones === 0;
    }
    return !this.juego.score_global || this.juego.score_global === 0;
  }

  mostrarMensajeTemporal(texto: string): void {
    this.mensajeAccion = texto;
    setTimeout(() => {
      this.mensajeAccion = null;
      this.cdr.detectChanges();
    }, 3500);
  }

  get coverClass(): string {
    const raw = this.juego?.imagen_cover || 'elden';
    const c = raw.replace('cover-', '');
    return c.startsWith('cover-') ? c : `cover-${c}`;
  }

  get isCoverImage(): boolean {
    const img = this.juego?.imagen_cover;
    if (!img) return false;
    return img.startsWith('http') || img.startsWith('assets') || img.startsWith('/') || img.includes('.');
  }

  get isPortadaImage(): boolean {
    const img = this.juego?.imagen_portada;
    if (!img) return false;
    return img.startsWith('http') || img.startsWith('assets') || img.startsWith('/') || img.includes('.');
  }

  get formattedScore(): string {
    const s = this.juego?.score_global;
    if (typeof s === 'number') {
      return s.toFixed(1);
    }
    if (typeof s === 'string') {
      const num = parseFloat(s);
      return isNaN(num) ? s : num.toFixed(1);
    }
    return '0.0';
  }

  get scorePercent(): number {
    const s = Number(this.juego?.score_global || 0);
    return Math.min(Math.max(s * 10, 0), 100);
  }

  get scoreLabelEvaluation(): string {
    const s = Number(this.juego?.score_global || 0);
    if (s >= 9.0) return 'Obra Maestra';
    if (s >= 8.0) return 'Excelente';
    if (s >= 7.0) return 'Muy Bueno';
    if (s >= 6.0) return 'Bueno';
    if (s >= 5.0) return 'Aceptable';
    return 'Calificación Regular';
  }

  volver(): void {
    this.router.navigate(['/videojuegos']);
  }
}
