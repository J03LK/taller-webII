import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../service/login.service';
import { RegistroService } from '../../service/registro.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  username: string = '';
  emailRegistro: string = '';
  passwordRegistro: string = '';
  signUpMode = false;

  constructor(
    private loginService: LoginService,
    private registroService: RegistroService,
    private route: Router
  ) {}

  login(formulario: any) {
    this.loginService.postLogin(formulario.value).subscribe({
      next: (accesso: any) => {
        console.log(accesso);
        let token = accesso.accessToken;
        let email = formulario.value.email;

        if (token) {
          localStorage.setItem("login", "true");

          if (email.includes('@admin.com')) {
            localStorage.setItem("acceso", "docentes");
            console.log("Usuario docente, redirigiendo...");
            this.route.navigate(['admin']);
          } else {
            localStorage.setItem("acceso", "estudiantes");
            console.log("Usuario estudiante, redirigiendo...");
            this.route.navigate(['denuncias']);
          }
        }
      },
      error: (error: any) => {
        console.error('Error en el inicio de sesión:', error);
      }
    });
  }

  register(registroForm: any) {
    console.log("Datos enviados al backend:", registroForm.value);
    
    this.registroService.postRegistro(registroForm.value).subscribe({
      next: (respuesta: any) => {
        console.log("Usuario registrado:", respuesta);
        alert("Registro exitoso. Ahora puedes iniciar sesión.");
        this.toggleSignUpMode();
      },
      error: (error: any) => {
        console.error('Error en el registro:', error);
      }
    });
  }
    toggleSignUpMode() {
    this.signUpMode = !this.signUpMode;
  }
}
