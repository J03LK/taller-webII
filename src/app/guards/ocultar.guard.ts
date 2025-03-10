import { CanMatchFn } from '@angular/router';

export const ocultarGuard: CanMatchFn = (route, segments) => {
  // Simplemente verifica si el usuario está autenticado
  return localStorage.getItem("login") === 'true';
};