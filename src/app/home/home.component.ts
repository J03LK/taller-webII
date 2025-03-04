import { Component } from '@angular/core';
import { ProgramasComponent } from "../components/programas/programas.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProgramasComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  

}

