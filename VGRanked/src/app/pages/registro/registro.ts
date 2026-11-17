import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  private api = inject(ApiService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  cargando = false;
  errorMensaje: string | null = null;
  exitoMensaje: string | null = null;

  fotoPreview: string | null = null;
  fotoBase64: string = '';

  userForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
    image: new FormControl(''), // Opcional
  });

  // Manejar selección de imagen de perfil desde archivo local
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validar tipo de imagen
      if (!file.type.startsWith('image/')) {
        this.errorMensaje = 'Por favor selecciona un archivo de imagen válido (JPG, PNG, WebP).';
        return;
      }

      // Validar tamaño máximo (hasta 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMensaje = 'La imagen seleccionada supera el límite recomendado de 5MB.';
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.fotoBase64 = reader.result as string;
        this.fotoPreview = this.fotoBase64;
        this.errorMensaje = null;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  // Quitar la imagen seleccionada
  quitarFoto(): void {
    this.fotoBase64 = '';
    this.fotoPreview = null;
    this.userForm.patchValue({ image: '' });
  }

  // Actualizar vista previa cuando el usuario escribe una URL
  onUrlChange(): void {
    const url = this.userForm.value.image?.trim();
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      this.fotoPreview = url;
    } else if (!this.fotoBase64) {
      this.fotoPreview = null;
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.errorMensaje = null;
    this.exitoMensaje = null;

    const username = this.userForm.value.username?.trim() || '';
    const email = this.userForm.value.email?.trim() || '';
    const password = this.userForm.value.password || '';
    const foto = this.fotoBase64 || this.userForm.value.image?.trim() || '';

    this.api.registro({
      username,
      correo: email,
      password,
      foto_perfil: foto,
    }).subscribe({
      next: (resp) => {
        this.cargando = false;
        this.exitoMensaje = 'Cuenta creada exitosamente. Iniciando sesión...';
        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/videojuegos']);
        }, 1200);
      },
      error: (err) => {
        this.cargando = false;
        const msg = err?.error?.mensaje || 'Hubo un error al registrar la cuenta. Inténtalo de nuevo.';
        this.errorMensaje = msg;
        this.cdr.detectChanges();
      }
    });
  }
}
