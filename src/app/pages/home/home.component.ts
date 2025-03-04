import { Component } from '@angular/core';
import { ProgramasComponent } from "../../components/programas/programas.component";
import { CarouselComponent } from "../../components/carousel/carousel.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselComponent, ProgramasComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  

}

