import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private api = inject(ApiService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  cargando = false;
  errorMensaje: string | null = null;
  exitoMensaje: string | null = null;

  userForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
  });

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.errorMensaje = null;
    this.exitoMensaje = null;

    const email = this.userForm.value.email?.trim() || '';
    const password = this.userForm.value.password || '';

    this.api.login({
      correo: email,
      password,
    }).subscribe({
      next: (resp) => {
        this.cargando = false;
        this.exitoMensaje = `¡Bienvenido de vuelta, ${resp.usuario.username}!`;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/videojuegos']);
        }, 1000);
      },
      error: (err) => {
        this.cargando = false;
        const msg = err?.error?.mensaje || 'Error al iniciar sesión. Verifica tu correo y contraseña.';
        this.errorMensaje = msg;
        this.cdr.detectChanges();
      }
    });
  }
}
