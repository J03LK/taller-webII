import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DenunciasService {

  constructor(private http: HttpClient) { }
  
  private API_DENUNCIAS = 'http://localhost:3001/denuncias'
  
  // Método para enviar denuncia
  postDenuncia(denuncia: any): Observable<any> {
    return this.http.post(this.API_DENUNCIAS, denuncia);
  }
  
  // Obtener todas las denuncias
  getDenuncias(): Observable<any[]> {
    return this.http.get<any[]>(this.API_DENUNCIAS);
  }
  
  // Eliminar denuncia por id
  deleteDenuncia(id: number): Observable<any> {
    return this.http.delete(`${this.API_DENUNCIAS}/${id}`);
  }
  
  // Obtener denuncia por id
  getDenunciaById(id: any): Observable<any> {
    return this.http.get(`${this.API_DENUNCIAS}/${id}`);
  }
  
  // Actualizar denuncia
  putDenuncia(denuncia: any): Observable<any> {
    return this.http.put(`${this.API_DENUNCIAS}/${denuncia.id}`, denuncia);
  }
}