import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

 
  constructor(private http:HttpClient) { }
  private API_LOGIN = 'http://localhost:3000/login';
  getLogin():Observable<any>

{
  return this.http.get(this.API_LOGIN);
    
  }
  postLogin(usuario:any):Observable<any>{
    return this.http.post(this.API_LOGIN,usuario);
  }
  
}
