import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  // Verificar si el usuario está autenticado
  isLoggedIn(): boolean {
    return localStorage.getItem("login") === 'true';
  }

  // Obtener el tipo de acceso del usuario (docentes o estudiantes)
  getTipoAcceso(): string {
    return localStorage.getItem("acceso") || '';
  }

  // Verificar si el usuario tiene uno de los roles permitidos
  tieneRol(rolesPermitidos: string[]): boolean {
    if (!this.isLoggedIn()) {
      return false;
    }
    
    const tipoAcceso = this.getTipoAcceso();
    return rolesPermitidos.includes(tipoAcceso);
  }

  // Verificar si es docente
  esDocente(): boolean {
    return this.getTipoAcceso() === 'admin';
  }

  // Verificar si es estudiante
  esEstudiante(): boolean {
    return this.getTipoAcceso() === 'estudiantes';
  }


}