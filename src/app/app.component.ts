import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProgramasComponent } from './components/programas/programas.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { SeccionAcademicaComponent } from './components/seccion-academica/seccion-academica.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HomeComponent, ProgramasComponent, SeccionAcademicaComponent, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'taller';
}
