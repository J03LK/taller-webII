import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { DenunciasService } from '../../service/denuncias.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { TabladenunciasComponent } from "../../components/tablaDenuncias/tabladenuncias.component";
import { LoginService } from '../../service/login.service';
import { UsuarioService } from '../../service/usuario.service';

// Registrar todos los componentes necesarios de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TabladenunciasComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  // Variables para los campos del formulario
  tipo: any;
  ubicacion: any;
  descripcion: any;
  contacto: any;
  denuncias: any[] = [];
  evidencia: any;
  fullName: string = '';
  
  // Propiedades para manejar la edición de usuario
  usuarioActual: any = {
    nombre: '',
    apellido: '',
    username: '',
    email: '',
    password: '' // Este campo se enviará vacío si no se va a cambiar la contraseña
  };
  
  activeTab: string = 'new-complaint'; // Pestaña predeterminada
  
  @ViewChild('estadoChart') estadoChartRef!: ElementRef;
  @ViewChild('tipoChart') tipoChartRef!: ElementRef;

  private estadoChart!: Chart;
  private tipoChart!: Chart;
  
  // Datos de muestra para los gráficos
  estadisticas = {
    total: 15,
    pendientes: 5,
    enProceso: 3,
    resueltas: 7
  };

  constructor(
    private servicio: DenunciasService, 
    private router: Router,
    private loginService: LoginService,
    private usuarioService: UsuarioService
  ) {}
  
  logout() { 
    localStorage.removeItem('currentUser');
    localStorage.setItem("login", "false");
    this.router.navigate(['login']);
  }

  ngOnInit(): void {
    // Obtener los datos del usuario actual del localStorage
    const userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
    console.log('userData en localStorage:', userData);
    
    // Usar username u otro identificador disponible
    const username = userData.username || userData.sub || userData.email;
    console.log('Username encontrado:', username);
    
    if (username) {
      // Obtener todos los usuarios y filtrar por username
      this.usuarioService.getUsuarios().subscribe(
        usuarios => {
          console.log('Usuarios obtenidos:', usuarios);
          const usuarioEncontrado = usuarios.find((u: any) => u.username === username);
          
          if (usuarioEncontrado) {
            this.fullName = usuarioEncontrado.nombre + (usuarioEncontrado.apellido ? ' ' + usuarioEncontrado.apellido : '');
            console.log('Usuario encontrado:', usuarioEncontrado);
            console.log('Nombre completo:', this.fullName);
            
            // Cargar los datos del usuario para el formulario de edición
            this.cargarDatosUsuario(usuarioEncontrado);
          } else {
            console.log('No se encontró usuario con username:', username);
          }
        },
        error => {
          console.error('Error al obtener usuarios:', error);
        }
      );
    } else {
      console.log('No se encontró username en localStorage');
    }
    
    // Cargar denuncias al inicializar
    this.servicio.getDenuncias().subscribe(
      (data) => {
        this.denuncias = data;
      },
      (error) => {
        console.error('Error al cargar denuncias:', error);
      }
    );
  }

  // Método para cargar los datos del usuario en el formulario
  cargarDatosUsuario(usuarioEncontrado?: any) {
    if (usuarioEncontrado) {
      // Si recibimos un usuario como parámetro, lo usamos
      this.usuarioActual = {
        id: usuarioEncontrado.id,
        nombre: usuarioEncontrado.nombre,
        apellido: usuarioEncontrado.apellido,
        username: usuarioEncontrado.username,
        email: usuarioEncontrado.email,
        password: '' // No cargamos la contraseña actual por seguridad
      };
    } else {
      // Si no, buscamos el usuario de nuevo
      const userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const username = userData.username || userData.sub || userData.email;
      
      if (username) {
        this.usuarioService.getUsuarios().subscribe(
          usuarios => {
            const usuarioEncontrado = usuarios.find((u: any) => u.username === username);
            if (usuarioEncontrado) {
              this.usuarioActual = {
                id: usuarioEncontrado.id,
                nombre: usuarioEncontrado.nombre,
                apellido: usuarioEncontrado.apellido,
                username: usuarioEncontrado.username,
                email: usuarioEncontrado.email,
                password: '' // No cargamos la contraseña actual por seguridad
              };
            }
          }
        );
      }
    }
  }

  // Método para guardar cambios del perfil
  guardarPerfilUsuario() {
    if (this.usuarioActual && this.usuarioActual.id) {
      // Si la contraseña está vacía, enviamos un objeto sin el campo password
      const datosActualizados = {...this.usuarioActual};
      if (!datosActualizados.password) {
        delete datosActualizados.password;
      }
      
      this.usuarioService.updateUsuario(this.usuarioActual.id, datosActualizados).subscribe(
        response => {
          console.log('Usuario actualizado correctamente', response);
          
          // Actualizar el nombre mostrado
          this.fullName = this.usuarioActual.nombre + 
            (this.usuarioActual.apellido ? ' ' + this.usuarioActual.apellido : '');
          
          // Mostrar mensaje de éxito
          alert('Perfil actualizado correctamente');
        },
        error => {
          console.error('Error al actualizar usuario', error);
          alert('Error al actualizar el perfil');
        }
      );
    }
  }

  // Método para cancelar cambios
  cancelarEdicion() {
    // Recargar los datos originales
    this.cargarDatosUsuario();
  }

  ngAfterViewInit(): void {
    if (this.activeTab === 'estado-denuncias') {
      setTimeout(() => {
        this.inicializarGraficos();
      }, 100);
    }
  }

  // Método para guardar denuncia
  guardarDenuncia(formulario: any) {
    this.servicio.postDenuncia(formulario.value).subscribe(() => {
      window.location.reload();
    });
  }
  
  // Método para eliminar denuncia
  eliminar(id: any) {
    if (confirm('¿Estás seguro de eliminar esta denuncia?')) {
      this.servicio.deleteDenuncia(id).subscribe(() => {
        window.location.reload();
      });
    }
  }

  // Método para manejar el cambio de archivo
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.evidencia = file;
      // Si necesitas convertir el archivo a base64 o procesarlo de alguna manera
      // puedes hacerlo aquí
    }
  }

  changeTab(tab: string) {
    console.log("Cambiando pestaña a:", tab);
    this.activeTab = tab;
    
    // Si cambiamos a la pestaña de estado, inicializamos los gráficos
    if (tab === 'estado-denuncias') {
      setTimeout(() => {
        this.inicializarGraficos();
      }, 100);
    }
  }
  
  // Método para inicializar los gráficos
  inicializarGraficos(): void {
    console.log('Inicializando gráficos...');
    console.log('Referencias:', this.estadoChartRef, this.tipoChartRef);
    
    // Asegurarnos de que los elementos existen
    if (this.estadoChartRef && this.tipoChartRef) {
      this.crearGraficoEstados();
      this.crearGraficoTipos();
    } else {
      console.error('No se encontraron las referencias a los canvas de los gráficos');
    }
  }
  
  // Crear gráfico de distribución por estado
  crearGraficoEstados(): void {
    const ctx = this.estadoChartRef.nativeElement.getContext('2d');
    
    // Destruir el gráfico existente si hay uno
    if (this.estadoChart) {
      this.estadoChart.destroy();
    }
    
    this.estadoChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Pendientes', 'En Proceso', 'Resueltas'],
        datasets: [{
          data: [
            this.estadisticas.pendientes,
            this.estadisticas.enProceso,
            this.estadisticas.resueltas
          ],
          backgroundColor: [
            '#fff8e1',  // Amarillo claro para pendientes
            '#e1f5fe',  // Azul claro para en proceso
            '#e8f5e9'   // Verde claro para resueltas
          ],
          borderColor: [
            '#ff8f00',  // Naranja para pendientes
            '#0288d1',  // Azul para en proceso
            '#2e7d32'   // Verde para resueltas
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                // Asegurarse de que value sea un número
                const value = typeof context.raw === 'number' ? context.raw : 0;
                
                // Calcular el total usando valores numéricos
                const dataValues = context.chart.data.datasets[0].data;
                let total = 0;
                for (let i = 0; i < dataValues.length; i++) {
                  total += Number(dataValues[i] || 0);
                }
                
                // Calcular el porcentaje con valores numéricos explícitos
                const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }
  
  // Crear gráfico de denuncias por tipo
  crearGraficoTipos(): void {
    const ctx = this.tipoChartRef.nativeElement.getContext('2d');
    
    // Destruir el gráfico existente si hay uno
    if (this.tipoChart) {
      this.tipoChart.destroy();
    }
    
    // Datos de ejemplo para tipos de denuncias
    const datos = {
      labels: ['Acoso', 'Discriminación', 'Corrupción', 'Abuso', 'Fraude', 'Violencia', 'Fallo del Sistema'],
      valores: [3, 2, 1, 4, 2, 1, 2]
    };
    
    this.tipoChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: datos.labels,
        datasets: [{
          label: 'Cantidad de denuncias',
          data: datos.valores,
          backgroundColor: [
            'rgba(25, 118, 210, 0.7)',  // Azul principal
            'rgba(76, 175, 80, 0.7)',   // Verde
            'rgba(255, 152, 0, 0.7)',   // Naranja
            'rgba(156, 39, 176, 0.7)',  // Morado
            'rgba(244, 67, 54, 0.7)',   // Rojo
            'rgba(0, 150, 136, 0.7)',   // Verde azulado
            'rgba(121, 85, 72, 0.7)'    // Marrón
          ],
          borderColor: [
            'rgba(25, 118, 210, 1)',
            'rgba(76, 175, 80, 1)',
            'rgba(255, 152, 0, 1)',
            'rgba(156, 39, 176, 1)',
            'rgba(244, 67, 54, 1)',
            'rgba(0, 150, 136, 1)',
            'rgba(121, 85, 72, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
}