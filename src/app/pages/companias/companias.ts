import { Component } from '@angular/core';

@Component({
  selector: 'app-companias',
  imports: [],
  templateUrl: './companias.html',
  styleUrl: './companias.css',
})
export class Companias {
  busqueda = '';
  paisSeleccionado = 'Todos';
  ordenSeleccionado = 'nombre';

 companias = [
    { nombre: 'Nintendo', pais: 'Japón', score: 9.4, color: 'elden'},
    { nombre: 'Sony Interactive', pais: 'Japón', score: 9.2, color: 'elden' },
    { nombre: 'FromSoftware', pais: 'Japón', score: 9.6, color: 'elden' },
    { nombre: 'CD Projekt Red', pais: 'Polonia', score: 9.3, color: 'elden' }
  ];

  get paises(): string[] {
    return [
      'Todos',
      ...new Set(this.companias.map(compania => compania.pais))
    ];
  }

  get companiasFiltradas() {
    const texto = this.busqueda.toLowerCase().trim();

    const resultado = this.companias.filter(compania => {
      const coincideNombre = compania.nombre.toLowerCase().includes(texto);
      const coincidePais =
        this.paisSeleccionado === 'Todos' ||
        compania.pais === this.paisSeleccionado;

      return coincideNombre && coincidePais;
    });

    return [...resultado].sort((a, b) => {
      if (this.ordenSeleccionado === 'score-desc') {
        return b.score - a.score;
      }

      if (this.ordenSeleccionado === 'score-asc') {
        return a.score - b.score;
      }

      return a.nombre.localeCompare(b.nombre);
    });
  }
}
