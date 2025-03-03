import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProgramasComponent } from './components/programas/programas.component';
import { FooterComponent } from './components/footer/footer.component';
import { CarouselComponent } from "./components/carousel/carousel.component";
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HomeComponent, ProgramasComponent, NavbarComponent, RouterModule, FooterComponent, CarouselComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'taller';
}
