import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private API_LOGIN = 'http://localhost:8080/api/auth/login';
  private currentUserKey = 'currentUser';

  constructor(private http: HttpClient) { }
  
  getLogin(): Observable<any> {
    return this.http.get(this.API_LOGIN);
  }
  
  postLogin(usuario: any): Observable<any> {
    return this.http.post(this.API_LOGIN, usuario).pipe(
      tap(response => {
        // Guarda la información del usuario después del login exitoso
        if (response) {
          localStorage.setItem(this.currentUserKey, JSON.stringify(response));
        }
      })
    );
  }

  // Obtener el usuario actual
  getCurrentUser(): any {
    const userData = localStorage.getItem(this.currentUserKey);
    return userData ? JSON.parse(userData) : null;
  }

  // Obtener el nombre completo del usuario actual
  getFullName(): string {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return '';
    
    // Asumiendo que la respuesta tiene campos nombre y apellido
    const nombre = currentUser.nombre || '';
    const apellido = currentUser.apellido || '';
    
    return `${nombre} ${apellido}`.trim();
  }

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem(this.currentUserKey);
    localStorage.removeItem('token'); // Si usas tokens
  }

  // Verificar si hay un usuario logueado
  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }
}