import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { DenunciasService, Denuncia, EstadoDenuncia } from '../../service/denuncias.service';
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
  tipo: string = '';
  ubicacion: string = '';
  descripcion: string = '';
  contacto: string = '';
  denuncias: any[] = [];
  denunciasUsuario: any[] = []; // Para almacenar denuncias del usuario logueado
  evidencia: File | null = null;
  fullName: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  
  // Propiedades para manejar la edición de usuario
  usuarioActual: any = {
    id: null,
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
  
  // Datos para los gráficos
  estadisticas = {
    total: 0,
    pendientes: 0,
    enProceso: 0,
    resueltas: 0,
    cerradas: 0,
    rechazadas: 0
  };

  tiposDenuncias: { [key: string]: number } = {};

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
            
            // Cargar denuncias del usuario logueado
            this.cargarDenunciasUsuario(usuarioEncontrado.id);
          } else {
            console.log('No se encontró usuario con username:', username);
          }
        },
        error => {
          console.error('Error al obtener usuarios:', error);
          this.errorMessage = 'No se pudieron cargar los datos del usuario.';
        }
      );
    } else {
      console.log('No se encontró username en localStorage');
    }
    
    // Cargar todas las denuncias al inicializar (usamos la versión simple)
    this.cargarTodasDenuncias();
  }

  // Método para cargar todas las denuncias
  cargarTodasDenuncias() {
    this.servicio.getDenunciasSimple().subscribe(
      (data) => {
        this.denuncias = data;
        console.log('Denuncias cargadas correctamente:', this.denuncias);
        
        // Una vez cargadas las denuncias, actualizamos las estadísticas
        this.actualizarEstadisticas();
      },
      (error) => {
        console.error('Error al cargar denuncias:', error);
        this.errorMessage = 'No se pudieron cargar las denuncias. Intente nuevamente.';
      }
    );
  }

  // Método para actualizar las estadísticas para los gráficos
  actualizarEstadisticas() {
    // Reiniciar contadores
    this.estadisticas = {
      total: this.denuncias.length,
      pendientes: 0,
      enProceso: 0,
      resueltas: 0,
      cerradas: 0,
      rechazadas: 0
    };
    
    this.tiposDenuncias = {};
    
    // Contar denuncias por estado y tipo
    this.denuncias.forEach(denuncia => {
      // Contar por estado
      if (denuncia.estado === EstadoDenuncia.PENDIENTE) {
        this.estadisticas.pendientes++;
      } else if (denuncia.estado === EstadoDenuncia.EN_PROCESO) {
        this.estadisticas.enProceso++;
      } else if (denuncia.estado === EstadoDenuncia.RESUELTA) {
        this.estadisticas.resueltas++;
      } else if (denuncia.estado === EstadoDenuncia.CERRADA) {
        this.estadisticas.cerradas++;
      } else if (denuncia.estado === EstadoDenuncia.RECHAZADA) {
        this.estadisticas.rechazadas++;
      }
      
      // Contar por tipo
      if (denuncia.tipo) {
        if (this.tiposDenuncias[denuncia.tipo]) {
          this.tiposDenuncias[denuncia.tipo]++;
        } else {
          this.tiposDenuncias[denuncia.tipo] = 1;
        }
      }
    });
    
    // Si estamos en la pestaña de estadísticas, actualizamos los gráficos
    if (this.activeTab === 'estado-denuncias') {
      setTimeout(() => {
        this.inicializarGraficos();
      }, 100);
    }
  }

  // Método para cargar denuncias del usuario logueado
  cargarDenunciasUsuario(userId: number) {
    console.log('Intentando cargar denuncias para el usuario ID:', userId);
    
    if (!userId) {
      console.error('Error: No se puede cargar denuncias sin ID de usuario');
      this.denunciasUsuario = []; 
      return;
    }
    
    // Ya que sabemos que mostrarSimple funciona, usamos ese endpoint
    this.servicio.getDenunciasSimple().subscribe({
      next: (todasDenuncias) => {
        console.log('Todas las denuncias obtenidas, filtrando para usuario:', userId);
        // Filtrar las denuncias por el ID de usuario
        this.denunciasUsuario = todasDenuncias.filter(
          denuncia => denuncia.usuario && denuncia.usuario.id === userId
        );
        
        if (this.denunciasUsuario.length === 0) {
          console.log('No se encontraron denuncias para este usuario ID:', userId);
        } else {
          console.log('Denuncias filtradas para el usuario:', this.denunciasUsuario);
        }
      },
      error: (error) => {
        console.error('Error al obtener todas las denuncias:', error);
        this.denunciasUsuario = [];
        this.errorMessage = 'No se pudieron cargar tus denuncias.';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
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
          },
          error => {
            console.error('Error al obtener usuario:', error);
            this.errorMessage = 'No se pudieron cargar los datos del usuario.';
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
          this.successMessage = 'Perfil actualizado correctamente';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error => {
          console.error('Error al actualizar usuario', error);
          this.errorMessage = 'Error al actualizar el perfil';
          setTimeout(() => this.errorMessage = '', 3000);
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
    console.log("Form submitted:", formulario);
    
    if (!this.usuarioActual.id) {
      this.errorMessage = 'No se pudo identificar el usuario actual. Inicie sesión nuevamente.';
      return;
    }
    
    if (!formulario.valid) {
      this.errorMessage = 'Por favor, complete todos los campos requeridos.';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }
    
    // Crear un objeto con los datos del formulario
    const datosFormulario: Denuncia = {
      tipo: this.tipo,
      ubicacion: this.ubicacion,
      descripcion: this.descripcion,
      contacto: this.contacto || '',
      usuario: {
        id: this.usuarioActual.id
      }
    };
    
    console.log("Datos a enviar:", datosFormulario);
    
    // Si hay evidencia, usar el método con evidencia
    if (this.evidencia) {
      this.servicio.createDenunciaWithEvidence(
        datosFormulario.tipo,
        datosFormulario.ubicacion,
        datosFormulario.descripcion,
        datosFormulario.contacto,
        this.usuarioActual.id,
        this.evidencia
      ).subscribe({
        next: (response) => this.handleDenunciaSuccess(response),
        error: (error) => this.handleDenunciaError(error)
      });
    } else {
      // Sin evidencia, usar el método normal
      this.servicio.createDenuncia(datosFormulario).subscribe({
        next: (response) => this.handleDenunciaSuccess(response),
        error: (error) => this.handleDenunciaError(error)
      });
    }
  }
  
  // Método para manejar respuesta exitosa al guardar denuncia
  private handleDenunciaSuccess(response: any) {
    console.log('Denuncia guardada exitosamente:', response);
    
    // Mostrar mensaje de éxito
    this.successMessage = 'Denuncia registrada correctamente';
    
    // Reiniciar los campos del formulario
    this.tipo = '';
    this.ubicacion = '';
    this.descripcion = '';
    this.contacto = '';
    this.evidencia = null;
    
    // Actualizar todas las denuncias primero
    this.cargarTodasDenuncias();
    
    // Luego filtrar para el usuario actual
    if (this.usuarioActual && this.usuarioActual.id) {
      // En lugar de usar getDenunciasByUsuario, llamamos a nuestro método que filtra localmente
      this.cargarDenunciasUsuario(this.usuarioActual.id);
    }
    
    // Cambiar a la pestaña de mis denuncias
    setTimeout(() => {
      this.activeTab = 'my-complaints';
    }, 300); // Dar un poco más de tiempo para que se carguen los datos
    
    setTimeout(() => this.successMessage = '', 3000);
  }
  
  // Método para manejar error al guardar denuncia
  private handleDenunciaError(error: any) {
    console.error('Error al guardar la denuncia:', error);
    
    // Mostrar un mensaje más informativo
    if (error.status === 400) {
      this.errorMessage = 'La solicitud no cumple con los requisitos del servidor. Revise los datos ingresados.';
    } else if (error.status === 401 || error.status === 403) {
      this.errorMessage = 'No tiene permisos para realizar esta acción.';
    } else {
      this.errorMessage = 'Error al registrar la denuncia. Por favor, intente nuevamente.';
    }
    
    setTimeout(() => this.errorMessage = '', 5000);
  }
  
  // Método para eliminar denuncia
  eliminar(id: any) {
    if (confirm('¿Estás seguro de eliminar esta denuncia?')) {
      this.servicio.deleteDenuncia(id).subscribe({
        next: () => {
          // Actualizar las listas de denuncias sin recargar la página
          if (this.usuarioActual && this.usuarioActual.id) {
            this.cargarDenunciasUsuario(this.usuarioActual.id);
          }
          this.cargarTodasDenuncias();
          
          this.successMessage = 'Denuncia eliminada correctamente';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          console.error('Error al eliminar la denuncia:', error);
          this.errorMessage = 'Error al eliminar la denuncia';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
  }

  // Método para generar PDF de una denuncia específica
  generarPDFDenuncia(id: number) {
    this.servicio.generarPDFDenuncia(id).subscribe({
      next: (blob) => {
        this.servicio.downloadPDF(blob, `denuncia_${id}.pdf`);
        this.successMessage = 'PDF generado correctamente';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error al generar PDF:', error);
        this.errorMessage = 'Error al generar el PDF de la denuncia';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  // Método para manejar el cambio de archivo
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.evidencia = file;
      console.log('Archivo seleccionado:', file.name);
    }
  }

  changeTab(tab: string) {
    console.log("Cambiando pestaña a:", tab);
    this.activeTab = tab;
    
    // Si cambiamos a la pestaña de mis denuncias, cargamos las denuncias del usuario
    if (tab === 'my-complaints' && this.usuarioActual && this.usuarioActual.id) {
      console.log('Cargando denuncias del usuario al cambiar a la pestaña');
      this.cargarDenunciasUsuario(this.usuarioActual.id);
    }
    
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
    
    // Usar datos reales de las estadísticas
    this.estadoChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Pendientes', 'En Proceso', 'Resueltas', 'Cerradas', 'Rechazadas'],
        datasets: [{
          data: [
            this.estadisticas.pendientes,
            this.estadisticas.enProceso,
            this.estadisticas.resueltas,
            this.estadisticas.cerradas,
            this.estadisticas.rechazadas
          ],
          backgroundColor: [
            '#fff8e1',  // Amarillo claro para pendientes
            '#e1f5fe',  // Azul claro para en proceso
            '#e8f5e9',  // Verde claro para resueltas
            '#e0e0e0',  // Gris claro para cerradas
            '#ffebee'   // Rojo claro para rechazadas
          ],
          borderColor: [
            '#ff8f00',  // Naranja para pendientes
            '#0288d1',  // Azul para en proceso
            '#2e7d32',  // Verde para resueltas
            '#757575',  // Gris para cerradas
            '#c62828'   // Rojo para rechazadas
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
                const value = typeof context.raw === 'number' ? context.raw : 0;
                
                const dataValues = context.chart.data.datasets[0].data;
                let total = 0;
                for (let i = 0; i < dataValues.length; i++) {
                  total += Number(dataValues[i] || 0);
                }
                
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
    
    // Convertir el objeto de tipos a arrays para el gráfico
    const tiposLabels = Object.keys(this.tiposDenuncias);
    const tiposValues = tiposLabels.map(tipo => this.tiposDenuncias[tipo]);
    
    // Si no hay datos, usar datos de ejemplo
    const labels = tiposLabels.length > 0 ? tiposLabels : 
      ['Acoso', 'Discriminación', 'Corrupción', 'Abuso', 'Fraude', 'Violencia', 'Fallo del Sistema'];
    
    const valores = tiposValues.length > 0 ? tiposValues : [0, 0, 0, 0, 0, 0, 0];
    
    // Colores para el gráfico
    const backgroundColor = [
      'rgba(25, 118, 210, 0.7)',  // Azul principal
      'rgba(76, 175, 80, 0.7)',   // Verde
      'rgba(255, 152, 0, 0.7)',   // Naranja
      'rgba(156, 39, 176, 0.7)',  // Morado
      'rgba(244, 67, 54, 0.7)',   // Rojo
      'rgba(0, 150, 136, 0.7)',   // Verde azulado
      'rgba(121, 85, 72, 0.7)'    // Marrón
    ];
    
    // Asegurarse de tener suficientes colores
    while (backgroundColor.length < labels.length) {
      backgroundColor.push(...backgroundColor);
    }
    
    this.tipoChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Cantidad de denuncias',
          data: valores,
          backgroundColor: backgroundColor.slice(0, labels.length),
          borderColor: backgroundColor.map(color => color.replace('0.7', '1')).slice(0, labels.length),
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