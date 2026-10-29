import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface OrderOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [],
  templateUrl: './filter-bar.html',
  styleUrl: './filter-bar.css',
})
export class FilterBar {
  // Búsqueda
  @Input() searchLabel = 'Buscar';
  @Input() searchPlaceholder = 'Escribe un nombre...';
  @Input() search = '';
  @Output() searchChange = new EventEmitter<string>();

  // Filtro intermedio opcional (género, país, etc.)
  @Input() filterLabel = '';
  @Input() filter = '';
  @Input() filterOptions: string[] = [];
  @Output() filterChange = new EventEmitter<string>();

  // Ordenamiento
  @Input() orderLabel = 'Ordenar por';
  @Input() order = 'nombre';
  @Input() orderOptions: OrderOption[] = [
    { label: 'Nombre (A-Z)', value: 'nombre' },
    { label: 'Mejor puntuación', value: 'score-desc' },
    { label: 'Menor puntuación', value: 'score-asc' },
  ];
  @Output() orderChange = new EventEmitter<string>();

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.search = value;
    this.searchChange.emit(value);
  }

  onFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.filter = value;
    this.filterChange.emit(value);
  }

  onOrderChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.order = value;
    this.orderChange.emit(value);
  }
}

