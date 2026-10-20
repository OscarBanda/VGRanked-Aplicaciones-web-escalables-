
import { Component } from '@angular/core';

@Component({
  selector: 'app-videojuegos',
  standalone: true,
  imports: [],
  templateUrl: './videojuegos.html',
  styleUrl: './videojuegos.css'
})
export class Videojuegos {
  busqueda = '';
  generoSeleccionado = 'Todos';
  ordenSeleccionado = 'nombre';

  videojuegos = [
    {
      nombre: 'Elden Ring',
      genero: 'RPG',
      plataformas: 'PC · PlayStation 5 · Xbox',
      score: 9.8,
      color: 'elden'
    },
    {
      nombre: 'Final Fantasy VII Rebirth',
      genero: 'RPG',
      plataformas: 'PlayStation 5',
      score: 9.5,
      color: 'final'
    },
    {
      nombre: 'Resident Evil 4',
      genero: 'Terror',
      plataformas: 'PC · PlayStation 5 · Xbox',
      score: 9.2,
      color: 'resident'
    },
    {
      nombre: 'The Legend of Zelda: Tears of the Kingdom',
      genero: 'Aventura',
      plataformas: 'Nintendo Switch',
      score: 9.7,
      color: 'zelda'
    },
    {
      nombre: 'Forza Horizon 5',
      genero: 'Carreras',
      plataformas: 'PC · Xbox',
      score: 9.0,
      color: 'forza'
    },
    {
      nombre: 'Baldur’s Gate 3',
      genero: 'RPG',
      plataformas: 'PC · PlayStation 5 · Xbox',
      score: 9.7,
      color: 'baldur'
    },
    {
      nombre: 'Silent Hill 2',
      genero: 'Terror',
      plataformas: 'PC · PlayStation 5',
      score: 9.1,
      color: 'silent'
    },
    {
      nombre: 'Super Mario Odyssey',
      genero: 'Aventura',
      plataformas: 'Nintendo Switch',
      score: 9.3,
      color: 'mario'
    },
    {
      nombre: 'Gran Turismo 7',
      genero: 'Carreras',
      plataformas: 'PlayStation 5 · PlayStation 4',
      score: 8.8,
      color: 'gran'
    }
  ];

  get generos(): string[] {
    return [
      'Todos',
      ...new Set(this.videojuegos.map(juego => juego.genero))
    ];
  }

  get videojuegosFiltrados() {
    const texto = this.busqueda.toLowerCase().trim();

    const resultado = this.videojuegos.filter(juego => {
      const coincideNombre = juego.nombre.toLowerCase().includes(texto);
      const coincideGenero =
        this.generoSeleccionado === 'Todos' ||
        juego.genero === this.generoSeleccionado;

      return coincideNombre && coincideGenero;
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
