import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }
  private API_USUARIO = 'http://localhost:8080/usuarios';
  
  getUsuarios(): Observable<any> {
    return this.http.get<any[]>(`${this.API_USUARIO}/mostrar`);
  }
  
  postUsuarios(usuario: any): Observable<any> {
    return this.http.post<any>(`${this.API_USUARIO}/guardarUsuario`, usuario);
  }
  
  deleteUsuario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_USUARIO}/eliminarUsuario/${id}`);
  }
  
  updateUsuario(id: number, usuario: any): Observable<any> {
    return this.http.put<any>(`${this.API_USUARIO}/actualizarUsuario/${id}`, usuario);
  }
}