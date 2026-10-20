import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  // Usuarios temporales en memoria
  users: any[] = [];

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
    image: new FormControl('', [
      Validators.required,
    ]),
  });

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const newUser = {
      id: this.users.length + 1,
      username: this.userForm.controls.username.value,
      email: this.userForm.controls.email.value,
      password: this.userForm.controls.password.value,
      image: this.userForm.controls.image.value,
    };

    this.users.push(newUser);

    console.log('Usuario registrado:', newUser);
    console.log('Todos los usuarios:', this.users);

    this.userForm.reset();
  }
}
