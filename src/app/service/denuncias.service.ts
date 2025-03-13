import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

// Definimos una interfaz para las denuncias
export interface Denuncia {
  id?: number;
  tipo: string;
  ubicacion: string;
  descripcion: string;
  contacto: string;
  estado?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  usuario: {
    id: number;
    nombre?: string;
  };
}

// Enumeración para los estados de denuncia
export enum EstadoDenuncia {
  PENDIENTE = 'PENDIENTE',
  EN_PROCESO = 'EN_PROCESO',
  RESUELTA = 'RESUELTA',
  CERRADA = 'CERRADA',
  RECHAZADA = 'RECHAZADA'
}

@Injectable({
  providedIn: 'root'
})
export class DenunciasService {
  
  private readonly API_DENUNCIA = 'http://localhost:8080/denuncias';
  
  constructor(private http: HttpClient) { }
  
  // Manejador de errores común
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código: ${error.status}, Mensaje: ${error.message}`;
      
      // Si hay un cuerpo de respuesta con mensaje
      if (error.error && typeof error.error === 'string') {
        errorMessage = error.error;
      }
      
      // Si el error es por autenticación
      if (error.status === 401 || error.status === 403) {
        console.error('Error de autenticación. Se requiere iniciar sesión.');
        // Aquí podrías redirigir al login o disparar un evento
      }
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
  
  // Obtener todas las denuncias
  getDenuncias(): Observable<Denuncia[]> {
    return this.http.get<Denuncia[]>(`${this.API_DENUNCIA}/mostrar`)
      .pipe(catchError(this.handleError));
  }
  
  // Obtener todas las denuncias en formato simplificado (evita referencias circulares)
  getDenunciasSimple(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_DENUNCIA}/mostrarSimple`)
      .pipe(catchError(this.handleError));
  }
  
  // Obtener denuncias por usuario
  getDenunciasByUsuario(id: number): Observable<Denuncia[]> {
    console.log(`Obteniendo denuncias para usuario ID: ${id}`);
    return this.http.get<Denuncia[]>(`${this.API_DENUNCIA}/usuario/${id}`)
      .pipe(catchError(this.handleError));
  }
  
  // Obtener denuncias por tipo
  getDenunciasByTipo(tipo: string): Observable<Denuncia[]> {
    return this.http.get<Denuncia[]>(`${this.API_DENUNCIA}/buscar/${tipo}`)
      .pipe(catchError(this.handleError));
  }
  
  // Obtener denuncias por estado
  getDenunciasByEstado(estado: EstadoDenuncia): Observable<Denuncia[]> {
    return this.http.get<Denuncia[]>(`${this.API_DENUNCIA}/estado/${estado}`)
      .pipe(catchError(this.handleError));
  }
  
  // Obtener una denuncia específica
  getDenunciaById(id: number): Observable<Denuncia> {
    return this.http.get<Denuncia>(`${this.API_DENUNCIA}/${id}`)
      .pipe(catchError(this.handleError));
  }
  
  // Crear nueva denuncia
  createDenuncia(denuncia: Denuncia): Observable<Denuncia> {
    return this.http.post<Denuncia>(`${this.API_DENUNCIA}/guardar`, denuncia)
      .pipe(catchError(this.handleError));
  }
  
  // Alias para mantener compatibilidad con código existente
  postDenuncia(denuncia: Denuncia): Observable<Denuncia> {
    return this.createDenuncia(denuncia);
  }
  
  // Crear denuncia con evidencia (usando FormData)
  createDenunciaWithEvidence(
    tipo: string, 
    ubicacion: string, 
    descripcion: string, 
    contacto: string, 
    usuarioId: number, 
    evidencia?: File
  ): Observable<Denuncia> {
    const formData = new FormData();
    formData.append('tipo', tipo);
    formData.append('ubicacion', ubicacion);
    formData.append('descripcion', descripcion);
    formData.append('contacto', contacto);
    formData.append('usuarioId', usuarioId.toString());
    
    if (evidencia) {
      formData.append('evidencia', evidencia, evidencia.name);
    }
    
    return this.http.post<Denuncia>(`${this.API_DENUNCIA}/guardarConEvidencia`, formData)
      .pipe(catchError(this.handleError));
  }
  
  // Actualizar denuncia existente
  updateDenuncia(id: number, denuncia: Denuncia): Observable<Denuncia> {
    return this.http.put<Denuncia>(`${this.API_DENUNCIA}/actualizar/${id}`, denuncia)
      .pipe(catchError(this.handleError));
  }
  
  // Cambiar estado de una denuncia
  cambiarEstadoDenuncia(id: number, estado: EstadoDenuncia): Observable<Denuncia> {
    return this.http.put<Denuncia>(`${this.API_DENUNCIA}/cambiarEstado/${id}?estado=${estado}`, {})
      .pipe(catchError(this.handleError));
  }
  
  // Eliminar denuncia
  deleteDenuncia(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_DENUNCIA}/eliminar/${id}`)
      .pipe(catchError(this.handleError));
  }
  
  // Generar PDF de todas las denuncias
  generarPDF(): Observable<Blob> {
    return this.http.get(`${this.API_DENUNCIA}/pdf`, {
      responseType: 'blob'
    }).pipe(catchError(this.handleError));
  }
  
  // Generar PDF de una denuncia específica
  generarPDFDenuncia(id: number): Observable<Blob> {
    return this.http.get(`${this.API_DENUNCIA}/pdf/${id}`, {
      responseType: 'blob'
    }).pipe(catchError(this.handleError));
  }
  
  // Descargar PDF
  downloadPDF(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}