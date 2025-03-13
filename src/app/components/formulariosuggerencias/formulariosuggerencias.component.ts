import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Denuncia, EstadoDenuncia, DenunciasService } from '../../service/denuncias.service';


@Component({
  selector: 'app-formulariosuggerencias',
  standalone: true,
  imports: [],
  templateUrl: './formulariosuggerencias.component.html',
  styleUrl: './formulariosuggerencias.component.css'
})
export class FormulariosuggerenciasComponent implements OnInit {
  denuncias: Denuncia[] = [];
  estadoDenuncia = EstadoDenuncia;

  constructor(private denunciasService: DenunciasService) {}

  ngOnInit(): void {
    this.cargarDenuncias();
  }

  cargarDenuncias() {
    this.denunciasService.getDenuncias().subscribe({
      next: (DenunciasService) => {
        this.denuncias = this.denuncias;
      },
      error: (error) => {
        console.error('Error al cargar denuncias', error);
        // Puedes agregar un manejo de error más amigable para el usuario
      }
    });
  }

  cambiarEstado(denuncia: Denuncia, nuevoEstado: EstadoDenuncia) {
    if (denuncia.id) {
      this.denunciasService.cambiarEstadoDenuncia(denuncia.id, nuevoEstado).subscribe({
        next: (denunciaActualizada) => {
          // Actualizar la denuncia en la lista
          const index = this.denuncias.findIndex(d => d.id === denuncia.id);
          if (index !== -1) {
            this.denuncias[index] = denunciaActualizada;
          }
        },
        error: (error) => {
          console.error('Error al cambiar el estado de la denuncia', error);
          // Manejo de error para el usuario
        }
      });
    }
  }
}