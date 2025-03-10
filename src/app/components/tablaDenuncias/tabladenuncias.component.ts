import { Component } from '@angular/core';
import { DenunciasService } from '../../service/denuncias.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tabladenuncias',
  standalone: true,
  imports: [],
  templateUrl: './tabladenuncias.component.html',
  styleUrl: './tabladenuncias.component.css'
})
export class TabladenunciasComponent {

 constructor(private servicio: DenunciasService) {
  }
  
  denuncias: any[] = [];
  
  ngOnInit() {
    this.servicio.getDenuncias().subscribe(denuncia => {
      this.denuncias = denuncia;
    })
  }
  
  eliminar(id: any) {
    this.servicio.deleteDenuncia(id).subscribe(() => {
      window.location.reload();
    })
  }}
