import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { DenunciasService, Denuncia, EstadoDenuncia } from '../../service/denuncias.service';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../service/usuario.service';

Chart.register(...registerables);

interface Suggestion {
  id: number;
  title: string;
  description: string;
  author: string;
  department: string;
  date: Date;
  status: string;
  priority: string;
}

interface Category {
  id: number;
  name: string;
  count: number;
  percentage: number;
  icon: string;
  color: string;
}

interface Comment {
  id: number;
  author: string;
  text: string;
  date: Date;
  suggestionTitle: string;
}

@Component({
  selector: 'app-suggestion-box',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css',
  encapsulation: ViewEncapsulation.None
})
export class SuggestionBoxComponent implements OnInit {
  // Estadísticas del dashboard
  totalSuggestions: number = 0;
  percentageIncrease: number = 0;
  implementedSuggestions: number = 0;
  implementationRate: number = 0;
  inReviewSuggestions: number = 0;
  averageReviewTime: number = 0;
  rejectedSuggestions: number = 0;
  rejectionRate: number = 0;
 
  // Filtro
  filterStatus: string = '';

  // Datos de sugerencias y denuncias
  recentSuggestions: any[] = []; // Usaremos any[] para poder manejar tanto Suggestion como Denuncia
  denuncias: Denuncia[] = [];
  
  // Mantener los datos originales como respaldo
  originalSuggestions: Suggestion[] = [];

  // Flag para identificar si estamos mostrando denuncias o sugerencias
  mostrandoDenuncias: boolean = false;

  // Contadores por tipo de denuncia
  tiposDenuncia: {[key: string]: number} = {
    'acoso': 0,
    'discriminacion': 0,
    'corrupcion': 0,
    'abuso': 0,
    'fraude': 0,
    'violencia': 0,
    'negligencia': 0,
    'fallo-sistema': 0,
    'otros': 0
  };
  
  constructor(private servicio: DenunciasService, private router: Router,private UsuarioService: UsuarioService) {}
  
  logout() { 
    localStorage.setItem("login", "false");
    this.router.navigate(['login']);
  }
  
  ngOnInit(): void {
    // Cargar denuncias desde el servicio
    this.loadDenuncias();
    this.cargarUsuarios();

  }

  // Método para cargar denuncias
  loadDenuncias(): void {
    // Intentar cargar denuncias del servicio
    this.servicio.getDenuncias().subscribe({
      next: (denuncias) => {
        console.log('Denuncias cargadas:', denuncias);
        if (denuncias && denuncias.length > 0) {
          // Guardar las denuncias originales
          this.denuncias = denuncias;
          
          // Mapear denuncias a formato de sugerencias para compatibilidad
          this.recentSuggestions = denuncias.map(denuncia => {
            return {
              id: denuncia.id,
              title: denuncia.tipo || 'Sin título',
              description: denuncia.descripcion || 'Sin descripción',
              author: denuncia.usuario?.nombre || 'Anónimo',
              department: denuncia.ubicacion || 'Sin departamento',
              date: denuncia.fechaCreacion ? new Date(denuncia.fechaCreacion) : new Date(),
              status: denuncia.estado || EstadoDenuncia.PENDIENTE,
              priority: this.mapDenunciaToPriority(denuncia.tipo || '')
            };
          });
          
          this.mostrandoDenuncias = true;
          
          // Actualizar estadísticas basadas en las denuncias
          this.updateStats(denuncias);
          
          // Inicializar gráficos después de cargar datos
          setTimeout(() => {
            this.initTiposDenunciaChart();
            this.initStatusChart();
          }, 100);
        }
      },
      error: (error) => {
        console.error('Error al cargar denuncias:', error);
        // En caso de error, mantener las sugerencias originales
        this.recentSuggestions = [...this.originalSuggestions];
        this.denuncias = [];
        this.mostrandoDenuncias = false;
      }
    });
  }
  verUsuario(id: number | undefined): void {
    if (!id) {
      console.error('ID de usuario no válido');
      return;
    }
    
    console.log(`Ver detalles del usuario ${id}`);
    // Aquí podrías implementar la lógica para ver detalles, como abrir un modal
  }
  
  // Editar usuario
  editarUsuario(id: number | undefined): void {
    if (!id) {
      console.error('ID de usuario no válido');
      return;
    }
    
    console.log(`Editar usuario ${id}`);
    // Aquí podrías implementar la lógica para editar un usuario
  }
  
  // Eliminar usuario
  eliminarUsuario(id: number | undefined): void {
    if (!id) {
      console.error('ID de usuario no válido');
      return;
    }
    
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      console.log(`Eliminando usuario ${id}`);
      
      this.UsuarioService.deleteUsuario(id).subscribe({
        next: () => {
          console.log('Usuario eliminado con éxito');
          // Actualizar la lista de usuarios después de eliminar
          this.cargarUsuarios();
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
          alert('Error al eliminar el usuario. Por favor, intente nuevamente.');
        }
      });
    }
  }
  
  // Método adicional para mapear tipo de denuncia a prioridad
  mapDenunciaToPriority(tipo: string): string {
    // Puedes definir tu lógica según los tipos de denuncia
    const tipoLower = tipo.toLowerCase();
    if (tipoLower.includes('urgente') || tipoLower.includes('grave')) {
      return 'high';
    } else if (tipoLower.includes('normal') || tipoLower.includes('regular')) {
      return 'medium';
    } else {
      return 'low';
    }
  }
  usuarios: any[] = [];

// Añade este método para cargar los usuarios
cargarUsuarios(): void {
  this.UsuarioService.getUsuarios().subscribe({
    next: (data) => {
      console.log('Usuarios cargados:', data);
      this.usuarios = data;
    },
    error: (error) => {
      console.error('Error al cargar usuarios:', error);
    }
  });
}
  
  // Actualizar estadísticas basadas en denuncias recibidas
  updateStats(denuncias: Denuncia[]): void {
    this.totalSuggestions = denuncias.length;
    
    // Contar denuncias por estado
    this.implementedSuggestions = denuncias.filter(d => d.estado === EstadoDenuncia.RESUELTA).length;
    this.inReviewSuggestions = denuncias.filter(d => d.estado === EstadoDenuncia.EN_PROCESO).length;
    this.rejectedSuggestions = denuncias.filter(d => d.estado === EstadoDenuncia.RECHAZADA).length;
    
    // Calcular porcentajes con dos decimales
    if (this.totalSuggestions > 0) {
      this.implementationRate = +(this.implementedSuggestions / this.totalSuggestions * 100).toFixed(2);
      this.rejectionRate = +(this.rejectedSuggestions / this.totalSuggestions * 100).toFixed(2);
    }
    
    // Contar denuncias por tipo
    this.resetTiposDenuncia();
    denuncias.forEach(denuncia => {
      const tipo = denuncia.tipo?.toLowerCase() || 'otros';
      if (tipo in this.tiposDenuncia) {
        this.tiposDenuncia[tipo]++;
      } else {
        this.tiposDenuncia['otros']++;
      }
    });
  }
  
  // Reiniciar contadores de tipos de denuncia
  resetTiposDenuncia() {
    for (const key in this.tiposDenuncia) {
      this.tiposDenuncia[key] = 0;
    }
  }
  
  // Ver detalles de una denuncia
  verDenuncia(id: number | undefined): void {
    if (!id) {
      console.error('ID no válido');
      return;
    }
    
    console.log(`Ver detalles de la denuncia ${id}`);
    // Aquí podrías navegar a una vista de detalle o abrir un modal
    // Por ejemplo:
    // this.router.navigate(['/denuncias', id]);
  }
  
  // Aprobar denuncia (cambiar a estado RESUELTA)
  aprobarDenuncia(id: number | undefined): void {
    if (!id) {
      console.error('ID no válido');
      return;
    }
    
    // Intentar cambiar el estado, pero recargamos la página de todos modos
    this.cambiarEstado(id, EstadoDenuncia.RESUELTA)
      .finally(() => {
        window.location.reload();
      });
  }
  
  rechazarDenuncia(id: number | undefined): void {
    if (!id) {
      console.error('ID no válido');
      return;
    }
    
    // Intentar cambiar el estado, pero recargamos la página de todos modos
    this.cambiarEstado(id, EstadoDenuncia.RECHAZADA)
      .finally(() => {
        window.location.reload();
      });
  }
  
  // Poner denuncia en proceso (cambia a estado EN_PROCESO)
  ponerEnProceso(id: number | undefined): void {
    if (!id) {
      console.error('ID no válido');
      return;
    }
    
    console.log(`Cambiando denuncia ${id} a EN_PROCESO`);
    console.log('Valor actual de EstadoDenuncia.EN_PROCESO:', EstadoDenuncia.EN_PROCESO);
    
    // Mostrar información de depuración
    console.log('Todos los estados disponibles:', EstadoDenuncia);
    
    this.servicio.cambiarEstadoDenuncia(id, EstadoDenuncia.EN_PROCESO)
      .subscribe({
        next: (denunciaActualizada) => {
          console.log('¡Denuncia actualizada correctamente!', denunciaActualizada);
          
          // Actualizar los datos locales
          const index = this.denuncias.findIndex(d => d.id === id);
          if (index !== -1) {
            this.denuncias[index].estado = EstadoDenuncia.EN_PROCESO;
            console.log('Denuncia actualizada localmente');
          }
          
          // Mostrar confirmación al usuario
          alert('La denuncia ha sido puesta en proceso correctamente.');
          
          // Recargar la página para reflejar los cambios
          window.location.reload();
        },
        error: (error) => {
          console.error('Error al cambiar estado:', error);
          
          // Mensaje de error detallado
          if (error.status === 0) {
            alert('Error de conexión con el servidor. Verifique que el servidor esté funcionando y accesible.');
          } else if (error.status === 401 || error.status === 403) {
            alert('No tiene permisos para realizar esta acción. Por favor, inicie sesión nuevamente.');
          } else {
            alert(`Error al cambiar el estado: ${error.message || 'Error desconocido'}`);
          }
        }
      });
  }
  
  // Método para eliminar denuncia
  eliminarDenuncia(id: number | undefined): void {
    if (!id) {
      console.error('ID no válido');
      return;
    }
    
    if (confirm('¿Estás seguro de que deseas eliminar esta denuncia?')) {
      console.log(`Eliminando denuncia ${id}`);
      this.servicio.deleteDenuncia(id).subscribe({
        next: () => {
          console.log('Denuncia eliminada con éxito');
          window.location.reload();
        },
        error: (error) => {
          console.error('Error al eliminar denuncia:', error);
          alert('Error al eliminar la denuncia. Por favor, intente nuevamente.');
        }
      });
    }
  }
  
  // Método cambiarEstado modificado para usar promesas
  cambiarEstado(id: number, nuevoEstado: EstadoDenuncia): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log(`Intentando cambiar estado a ${nuevoEstado} para denuncia ID: ${id}`);
      
      // Verificar que el estado es válido
      const estadosValidos = Object.values(EstadoDenuncia);
      if (!estadosValidos.includes(nuevoEstado)) {
        console.error(`Estado "${nuevoEstado}" no es válido. Estados válidos:`, estadosValidos);
        reject(new Error(`Estado "${nuevoEstado}" no válido`));
        return;
      }
      
      this.servicio.cambiarEstadoDenuncia(id, nuevoEstado).subscribe({
        next: (denunciaActualizada) => {
          console.log(`Estado de denuncia actualizado a ${nuevoEstado}:`, denunciaActualizada);
          
          // Actualizar el estado localmente
          const index = this.denuncias.findIndex(d => d.id === id);
          if (index !== -1) {
            this.denuncias[index].estado = nuevoEstado;
            
            // Actualizar también en recentSuggestions
            const suggestionIndex = this.recentSuggestions.findIndex(s => s.id === id);
            if (suggestionIndex !== -1) {
              this.recentSuggestions[suggestionIndex].status = nuevoEstado;
            }
            
            // Actualizar estadísticas
            this.updateStats(this.denuncias);
          }
          
          resolve();
        },
        error: (error) => {
          console.error(`Error al cambiar estado a ${nuevoEstado}:`, error);
          reject(error);
        }
      });
    });
  }
  // Método para generar PDF de todas las denuncias
  generarPDF(): void {
    console.log('Generando PDF de denuncias');
    
    this.servicio.generarPDF().subscribe({
      next: (blob) => {
        console.log('PDF generado correctamente');
        // Usar el método del servicio para descargar el PDF
        this.servicio.downloadPDF(blob, 'listado-denuncias.pdf');
      },
      error: (error) => {
        console.error('Error al generar PDF:', error);
        alert('Error al generar PDF. Por favor, intente nuevamente.');
      }
    });
  }
     
  // Mostrar opciones adicionales (menú desplegable)
  mostrarOpciones(id: number | undefined): void {
    if (!id) {
      console.error('ID no válido');
      return;
    }
    
    console.log(`Mostrando opciones para denuncia ${id}`);
    // Aquí podrías implementar un menú contextual o dropdown
  }
  
  getPriorityClass(priority: string | undefined): string {
    // Si la prioridad es undefined, retornar valor por defecto
    if (!priority) {
      return 'priority-medium';
    }
  
    // Si estamos mostrando denuncias, adaptamos el tipo de denuncia
    if (this.mostrandoDenuncias) {
      switch (priority.toLowerCase()) {
        case 'urgente': return 'priority-high';
        case 'normal': return 'priority-medium';
        case 'baja': return 'priority-low';
        default: return 'priority-medium';
      }
    } else {
      // Comportamiento original para sugerencias
      switch (priority) {
        case 'high': return 'priority-high';
        case 'medium': return 'priority-medium';
        case 'low': return 'priority-low';
        default: return 'priority-medium';
      }
    }
  }
  
  getStatusClass(status: string): string {
    // Si estamos mostrando denuncias, adaptamos los estados
    if (this.mostrandoDenuncias) {
      switch (status) {
        case EstadoDenuncia.PENDIENTE: return 'bg-secondary';
        case EstadoDenuncia.EN_PROCESO: return 'bg-warning text-dark';
        case EstadoDenuncia.RESUELTA: return 'bg-success';
        case EstadoDenuncia.CERRADA: return 'bg-info';
        case EstadoDenuncia.RECHAZADA: return 'bg-danger';
        default: return 'bg-secondary';
      }
    } else {
      // Comportamiento original para sugerencias
      switch (status) {
        case 'Pendiente': return 'bg-secondary';
        case 'En revisión': return 'bg-warning text-dark';
        case 'Implementada': return 'bg-success';
        case 'Rechazada': return 'bg-danger';
        default: return 'bg-secondary';
      }
    }
  }
  getDenunciasImplementadas(): Denuncia[] {
    return this.denuncias.filter(denuncia => denuncia.estado === EstadoDenuncia.RESUELTA);
  }
  
  // Método para obtener denuncias en revisión (estado EN_PROCESO)
  getDenunciasEnRevision(): Denuncia[] {
    return this.denuncias.filter(denuncia => denuncia.estado === EstadoDenuncia.EN_PROCESO);
  }
  
  // Método para obtener denuncias rechazadas (estado RECHAZADA)
  getDenunciasRechazadas(): Denuncia[] {
    return this.denuncias.filter(denuncia => denuncia.estado === EstadoDenuncia.RECHAZADA);
  }
  
  // Método para obtener denuncias pendientes (estado PENDIENTE)
  getDenunciasPendientes(): Denuncia[] {
    return this.denuncias.filter(denuncia => denuncia.estado === EstadoDenuncia.PENDIENTE);
  }
  filterSuggestions(item: any): boolean {
    if (!this.filterStatus) return true;

    if (this.mostrandoDenuncias) {
      // Filtrado para denuncias
      const denuncia = item as Denuncia;
      switch (this.filterStatus) {
        case 'pending': return denuncia.estado === EstadoDenuncia.PENDIENTE;
        case 'in-review': return denuncia.estado === EstadoDenuncia.EN_PROCESO;
        case 'implemented': return denuncia.estado === EstadoDenuncia.RESUELTA;
        case 'rejected': return denuncia.estado === EstadoDenuncia.RECHAZADA;
        default: return true;
      }
    } else {
      // Filtrado original para sugerencias
      const suggestion = item as Suggestion;
      switch (this.filterStatus) {
        case 'pending': return suggestion.status === 'Pendiente';
        case 'in-review': return suggestion.status === 'En revisión';
        case 'implemented': return suggestion.status === 'Implementada';
        case 'rejected': return suggestion.status === 'Rechazada';
        default: return true;
      }
    }
  }
  
  // Método para graficar tipos de denuncia
  private initTiposDenunciaChart(): void {
    const deptCtx = document.getElementById('departmentChart') as HTMLCanvasElement;
    if (!deptCtx) return;

    // Preparar datos para el gráfico
    const labels = Object.keys(this.tiposDenuncia).map(key => {
      // Formatear la etiqueta para mostrarla más amigable
      return key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' ');
    });
    
    const data = Object.values(this.tiposDenuncia);

    const deptChart = new Chart(deptCtx.getContext('2d')!, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Cantidad de denuncias por tipo',
          data: data,
          backgroundColor: 'rgba(67, 97, 238, 0.7)',
          borderColor: 'rgba(67, 97, 238, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });
  }

  private initStatusChart(): void {
    const statusCtx = document.getElementById('statusChart') as HTMLCanvasElement;
    if (!statusCtx) return;

    const statusChart = new Chart(statusCtx.getContext('2d')!, {
      type: 'doughnut',
      data: {
        labels: ['Pendientes', 'En Proceso', 'Resueltas', 'Rechazadas'],
        datasets: [{
          data: [
            this.denuncias.filter(d => d.estado === EstadoDenuncia.PENDIENTE).length,
            this.denuncias.filter(d => d.estado === EstadoDenuncia.EN_PROCESO).length,
            this.denuncias.filter(d => d.estado === EstadoDenuncia.RESUELTA).length,
            this.denuncias.filter(d => d.estado === EstadoDenuncia.RECHAZADA).length
          ],
          backgroundColor: [
            'rgba(108, 117, 125, 0.8)',  // Pendientes
            'rgba(255, 193, 7, 0.8)',    // En Proceso
            'rgba(40, 167, 69, 0.8)',    // Resueltas
            'rgba(220, 53, 69, 0.8)'     // Rechazadas
          ],
          borderColor: [
            'rgba(108, 117, 125, 1)',
            'rgba(255, 193, 7, 1)',
            'rgba(40, 167, 69, 1)',
            'rgba(220, 53, 69, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%'
      }
    });
  }
  
  activeTab: string = 'dashboard'; // Valor inicial de la pestaña activa

  // Método para cambiar de pestaña
  changeTab(tab: string) {
    console.log("Cambiando pestaña a:", tab);
    this.activeTab = tab;
    
    // Si necesitas inicializar algo específico cuando cambias a una pestaña
    if (tab === 'statistics') {
      setTimeout(() => {
        this.initTiposDenunciaChart();
        this.initStatusChart();
      }, 100);
    }
  }
}