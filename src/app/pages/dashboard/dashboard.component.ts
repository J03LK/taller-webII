import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';

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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  
})
export class DashboardComponent implements OnInit {
  // Estadísticas
  totalSuggestions: number = 124;
  percentageIncrease: number = 12.5;
  implementedSuggestions: number = 48;
  implementationRate: number = 38.7;
  inReviewSuggestions: number = 35;
  averageReviewTime: number = 4.2;
  rejectedSuggestions: number = 41;
  rejectionRate: number = 33.1;

  // Filtro
  filterStatus: string = '';

  // Datos de sugerencias
  recentSuggestions: Suggestion[] = [
    {
      id: 1,
      title: 'Mejorar el sistema de gestión de archivos',
      description: 'Actualmente el sistema de archivos es muy lento y no permite una categorización eficiente. Sugiero implementar etiquetas y una búsqueda mejorada.',
      author: 'Juan Pérez',
      department: 'IT',
      date: new Date('2023-06-10'),
      status: 'Pendiente',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Actualizar equipos de la sala de reuniones',
      description: 'Los proyectores y sistemas de audio en la sala de reuniones principal necesitan ser actualizados, ya que fallan constantemente durante presentaciones importantes.',
      author: 'María Gómez',
      department: 'Administración',
      date: new Date('2023-06-08'),
      status: 'En revisión',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Programa de bienestar para empleados',
      description: 'Sugiero implementar un programa de bienestar que incluya membresías de gimnasio y sesiones de manejo del estrés para mejorar la salud mental y física.',
      author: 'Carlos Rodríguez',
      department: 'RRHH',
      date: new Date('2023-06-05'),
      status: 'Implementada',
      priority: 'low'
    },
    {
      id: 4,
      title: 'Optimizar proceso de facturación',
      description: 'El proceso actual de facturación tiene muchos pasos manuales que podrían ser automatizados para reducir errores y mejorar la eficiencia.',
      author: 'Ana Martínez',
      department: 'Finanzas',
      date: new Date('2023-06-01'),
      status: 'Rechazada',
      priority: 'high'
    }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    // Inicializar gráficos solo si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initDepartmentChart();
        this.initStatusChart();
      }, 100);
    }
  }

  getPriorityClass(priority: string): string {
    return priority;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pendiente': return 'bg-secondary';
      case 'En revisión': return 'bg-warning text-dark';
      case 'Implementada': return 'bg-success';
      case 'Rechazada': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  filterSuggestions(suggestion: Suggestion): boolean {
    if (!this.filterStatus) return true;

    switch (this.filterStatus) {
      case 'pending': return suggestion.status === 'Pendiente';
      case 'in-review': return suggestion.status === 'En revisión';
      case 'implemented': return suggestion.status === 'Implementada';
      case 'rejected': return suggestion.status === 'Rechazada';
      default: return true;
    }
  }

  private initDepartmentChart(): void {
    // Verificar que estamos en el navegador
    if (!isPlatformBrowser(this.platformId)) return;

    const deptCtx = document.getElementById('departmentChart') as HTMLCanvasElement;
    if (!deptCtx) return;

    const deptChart = new Chart(deptCtx.getContext('2d')!, {
      type: 'bar',
      data: {
        labels: ['IT', 'RRHH', 'Ventas', 'Marketing', 'Finanzas', 'Producción', 'Administración'],
        datasets: [{
          label: 'Número de sugerencias',
          data: [42, 28, 15, 19, 12, 8, 18],
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  private initStatusChart(): void {
    // Verificar que estamos en el navegador
    if (!isPlatformBrowser(this.platformId)) return;

    const statusCtx = document.getElementById('statusChart') as HTMLCanvasElement;
    if (!statusCtx) return;

    const statusChart = new Chart(statusCtx.getContext('2d')!, {
      type: 'doughnut',
      data: {
        labels: ['Pendientes', 'En revisión', 'Implementadas', 'Rechazadas'],
        datasets: [{
          data: [24, 35, 48, 41],
          backgroundColor: [
            'rgba(108, 117, 125, 0.8)',
            'rgba(255, 193, 7, 0.8)',
            'rgba(40, 167, 69, 0.8)',
            'rgba(220, 53, 69, 0.8)'
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
      }
    });
  }
}