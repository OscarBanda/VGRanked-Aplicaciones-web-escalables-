import { Component } from '@angular/core';

@Component({
  selector: 'app-consolas',
  imports: [],
  templateUrl: './consolas.html',
  styleUrl: './consolas.css',
})
export class Consolas {
  busqueda = '';
  ordenSeleccionado = 'nombre';

 consolas = [
    { nombre: 'Nintendo Switch', anio: '2025', score: 9.4, color: 'elden'},
    { nombre: 'Play Station 5', anio: '2020', score: 9.2, color: 'elden' },
    { nombre: 'Xbox Series X', anio: '2020', score: 9.6, color: 'elden' },
    { nombre: 'Steam', anio: '2010', score: 9.3, color: 'elden' }
  ];

  get consolasFiltradas() {
    const texto = this.busqueda.toLowerCase().trim();

    const resultado = this.consolas.filter(consola => {
      const coincideNombre = consola.nombre.toLowerCase().includes(texto);
      return coincideNombre;
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
