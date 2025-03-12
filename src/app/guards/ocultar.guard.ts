import { CanMatchFn } from '@angular/router';

export const ocultarGuard: CanMatchFn = (route, segments) => {
  
  return localStorage.getItem("login") === 'true';
};