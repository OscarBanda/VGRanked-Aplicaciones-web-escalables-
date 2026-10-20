import { Component } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgClass],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  videojuegosRecientes = [
    {
      nombre: 'Elden Ring',
      genero: 'RPG / Acción',
      plataformas: 'PC · PS5 · Xbox',
      score: 9.8,
      color: 'cover-elden'
    },
    {
      nombre: 'Final Fantasy VII Rebirth',
      genero: 'RPG',
      plataformas: 'PS5',
      score: 9.5,
      color: 'cover-final'
    },
    {
      nombre: 'Resident Evil 4',
      genero: 'Survival Horror',
      plataformas: 'PC · PS5 · Xbox',
      score: 9.2,
      color: 'cover-resident'
    }
  ];

  videojuegosMejorRankeados = [
    {
      nombre: 'Elden Ring',
      genero: 'RPG / Acción',
      score: 9.8
    },
    {
      nombre: 'Baldur’s Gate 3',
      genero: 'RPG',
      score: 9.7
    },
    {
      nombre: 'The Witcher 3',
      genero: 'RPG / Mundo abierto',
      score: 9.6
    },
    {
      nombre: 'Red Dead Redemption 2',
      genero: 'Acción / Aventura',
      score: 9.5
    }
  ];

  companiasDestacadas = [
    { nombre: 'Nintendo', pais: 'Japón', score: 9.4 },
    { nombre: 'Sony Interactive', pais: 'Japón', score: 9.2 },
    { nombre: 'FromSoftware', pais: 'Japón', score: 9.6 },
    { nombre: 'CD Projekt Red', pais: 'Polonia', score: 9.3 }
  ];
}
