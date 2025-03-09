import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

 constructor(private http:HttpClient) { }
  private API_REGISTRO = 'http://localhost:3000/users';
  getLogin():Observable<any>

{
  return this.http.get(this.API_REGISTRO);
    
  }
  postRegistro(usuario: any): Observable<any> {
    return this.http.post(this.API_REGISTRO, usuario);
  }
  
  
}

