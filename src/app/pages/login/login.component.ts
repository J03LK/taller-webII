import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  signUpMode = false;

  // Función para alternar el modo
  toggleSignUpMode() {
    this.signUpMode = !this.signUpMode;
  }
}
