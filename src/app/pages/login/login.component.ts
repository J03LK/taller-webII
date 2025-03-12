import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../service/login.service';
import { RegistroService } from '../../service/registro.service';
import { Router } from '@angular/router';
import { UsuarioService } from '../../service/usuario.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // Variables para login original
  email: string = '';
  password: string = '';
  username: string = '';
  signUpMode = false;
  
  // Variables para usuario
  Nombre: string = '';
  Apellido: string = '';
  Email: string = '';
  Password: string = '';
  Rol: string = 'USUARIO'; // Establecer valor por defecto
  Username: string = '';

  constructor(
    private loginService: LoginService,
    private registroService: RegistroService,
    private route: Router,
    private usuarioService: UsuarioService
  ) {}

  login(formulario: any) {
    this.loginService.postLogin(formulario.value).subscribe({
      next: (response: any) => {
        console.log(response);
        let token = response.accessToken;
        let rol = response.rol;
        
        if (token) {
          localStorage.setItem("login", "true");
          localStorage.setItem("token", token);
          
          if (rol === 'ADMIN') {
            localStorage.setItem("acceso", "admin");
            console.log("Usuario administrador, redirigiendo...");
            this.route.navigate(['admin']);
          } else {
            localStorage.setItem("acceso", "usuario");
            console.log("Usuario regular, redirigiendo...");
            this.route.navigate(['denuncias']);
          }
        }
      },
      error: (error: any) => {
        console.error('Error en el inicio de sesión:', error);
        alert("Error al iniciar sesión. Verifica tus credenciales.");
      }
    });
  }

  register(registroForm: any) {
    console.log("Datos enviados al backend:", registroForm.value);
    
    // Asegurar que Rol siempre es USUARIO
    const userData = {
      ...registroForm.value,
      rol: 'USUARIO'
    };
    
    
    this.usuarioService.postUsuarios(userData).subscribe({
      next: (respuesta: any) => {
        console.log("Usuario registrado:", respuesta);
        alert("Registro exitoso. Ahora puedes iniciar sesión.");
        this.toggleSignUpMode();
      },
      error: (error: any) => {
        console.error('Error en el registro:', error);
        alert("Error al registrar usuario: " + error.message);
      }
    });
  }

  toggleSignUpMode() {
    this.signUpMode = !this.signUpMode;
  }
}