import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  @Input() nombre = '';
  @Input() subtitulo?: string;
  @Input() detalle?: string;
  @Input() score?: number;
  @Input() color = '';
  @Input() imagen?: string;
  @Input() scoreLabel = 'Score global';
  @Input() routerLink?: any[] | string;

  /** Permite pasar el objeto completo directamente (juego, consola, compañía) */
  @Input() item?: any;

  get displayNombre(): string {
    return this.nombre || this.item?.nombre || '';
  }

  get displaySubtitulo(): string | undefined {
    return this.subtitulo ?? this.item?.genero ?? this.item?.subtitulo;
  }

  get displayDetalle(): string | undefined {
    return (
      this.detalle ??
      this.item?.plataformas ??
      this.item?.anio ??
      this.item?.abreviatura ??
      this.item?.pais ??
      this.item?.informacion_general ??
      this.item?.detalle
    );
  }

  /** Obtiene la URL de la imagen si existe */
  get displayImagen(): string | null {
    const img = this.imagen ||
      this.item?.imagen_portada ||
      this.item?.imagen ||
      this.item?.imagen_logo;

    if (img && (img.startsWith('http') || img.startsWith('assets') || img.startsWith('/'))) {
      return img;
    }
    return null;
  }

  get displayColor(): string {
    const raw = this.color || this.item?.color || this.item?.imagen_cover || 'elden';
    return raw.replace('cover-', '');
  }

  get coverClass(): string {
    const c = this.displayColor;
    if (!c) return 'cover-elden';
    return c.startsWith('cover-') ? c : `cover-${c}`;
  }

  get estaSinCalificar(): boolean {
    if (this.item?.total_calificaciones !== undefined && this.item?.total_calificaciones !== null) {
      return this.item.total_calificaciones === 0;
    }
    const s = this.score ?? this.item?.score_global ?? this.item?.score;
    // Para consolas y compañías que tienen score_ranking fijo, no aplica
    if (this.item?.score_ranking !== undefined) {
      return false;
    }
    return !s || Number(s) === 0;
  }

  get formattedScore(): string {
    const s = this.score ?? this.item?.score_global ?? this.item?.score_ranking ?? this.item?.score;
    if (typeof s === 'number') {
      return s.toFixed(1);
    }
    if (typeof s === 'string') {
      const num = parseFloat(s);
      return isNaN(num) ? s : num.toFixed(1);
    }
    return '0.0';
  }
}
