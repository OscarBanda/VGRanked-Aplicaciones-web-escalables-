import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Videojuegos } from './pages/videojuegos/videojuegos';
import { Companias } from './pages/companias/companias';
import { Consolas } from './pages/consolas/consolas';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Home},
    { path: 'videojuegos', component: Videojuegos},
    { path: 'companias', component: Companias},
    {path: 'consolas', component: Consolas},
    {path: 'login', component: Login},
    {path: 'registro', component: Registro},
];
