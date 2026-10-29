import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  @Input() nombre = '';
  @Input() subtitulo?: string;
  @Input() detalle?: string;
  @Input() score?: number;
  @Input() color = '';
  @Input() brand = 'VG RANKED';
  @Input() scoreLabel = 'Score global';

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
      this.item?.pais ??
      this.item?.detalle
    );
  }

  get displayColor(): string {
    return this.color || this.item?.color || 'elden';
  }

  get coverClass(): string {
    const c = this.displayColor;
    if (!c) return 'cover-elden';
    return c.startsWith('cover-') ? c : `cover-${c}`;
  }

  get formattedScore(): string {
    const s = this.score ?? this.item?.score;
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

