import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { DenunciasService } from '../../service/denuncias.service';
import { Router } from '@angular/router';

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
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css',
  encapsulation: ViewEncapsulation.None
})
export class SuggestionBoxComponent implements OnInit {
  // Estadísticas del dashboard
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

  // Categorías populares
  popularCategories: Category[] = [
    {
      id: 1,
      name: 'Mejoras tecnológicas',
      count: 42,
      percentage: 76,
      icon: 'laptop',
      color: '#4361EE'
    },
    {
      id: 2,
      name: 'Recursos Humanos',
      count: 28,
      percentage: 65,
      icon: 'people',
      color: '#F72585'
    },
    {
      id: 3,
      name: 'Procesos internos',
      count: 19,
      percentage: 48,
      icon: 'diagram-3',
      color: '#4CC9F0'
    },
    {
      id: 4,
      name: 'Infraestructura',
      count: 15,
      percentage: 36,
      icon: 'building',
      color: '#3F37C9'
    }
  ];

  // Comentarios recientes
  recentComments: Comment[] = [
    {
      id: 1,
      author: 'Laura Torres',
      text: 'Esta idea mejoraría significativamente nuestro flujo de trabajo. Recomiendo implementarla lo antes posible.',
      date: new Date('2023-06-09T14:30:00'),
      suggestionTitle: 'Mejorar el sistema de gestión de archivos'
    },
    {
      id: 2,
      author: 'Miguel Ángel Sánchez',
      text: 'Creo que podemos ampliar esta propuesta incluyendo también un análisis de costo-beneficio para cada iniciativa.',
      date: new Date('2023-06-08T09:15:00'),
      suggestionTitle: 'Optimizar proceso de facturación'
    },
    {
      id: 3,
      author: 'Patricia Guzmán',
      text: 'Ya hemos intentado algo similar en el pasado sin éxito. Deberíamos revisar qué falló anteriormente antes de volver a intentarlo.',
      date: new Date('2023-06-07T16:45:00'),
      suggestionTitle: 'Programa de bienestar para empleados'
    }
  ];
 constructor(private servicio: DenunciasService, private router: Router) {}
 logout() { 
  localStorage.setItem("login", "false");
  this.router.navigate(['login']);
}
  ngOnInit(): void {
    // Inicializar gráficos después de que Angular haya renderizado la vista
    setTimeout(() => {
      this.initDepartmentChart();
      this.initStatusChart();
    }, 100);
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
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
    const deptCtx = document.getElementById('departmentChart') as HTMLCanvasElement;
    if (!deptCtx) return;

    const deptChart = new Chart(deptCtx.getContext('2d')!, {
      type: 'bar',
      data: {
        labels: ['IT', 'RRHH', 'Ventas', 'Marketing', 'Finanzas', 'Producción', 'Administración'],
        datasets: [{
          label: 'Número de sugerencias',
          data: [42, 28, 15, 19, 12, 8, 18],
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
            beginAtZero: true
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
        cutout: '70%'
      }
    });
  }
  activeTab: string = 'dashboard'; // Valor inicial de la pestaña activa

// Añade este método a la clase (puedes colocarlo después del método de logout)
changeTab(tab: string) {
  console.log("Cambiando pestaña a:", tab);
  this.activeTab = tab;
  
  // Si necesitas inicializar algo específico cuando cambias a una pestaña
  if (tab === 'statistics') {
    setTimeout(() => {
      this.initDepartmentChart();
      this.initStatusChart();
    }, 100);
  }
}
}