import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-programas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './programas.component.html',
  styleUrl: './programas.component.css'
})
export class ProgramasComponent implements OnInit {
  stats = [
    { number: 0, text: "CARRERAS TECNOLÓGICAS", icon: "book" },
    { number: 0, text: "DOCENTES ESPECIALIZADOS", icon: "school" },
    { number: 0, text: "ESTUDIANTES GRADUADOS", icon: "groups" },
    { number: 0, text: "ESTUDIANTES MATRICULADOS", icon: "trending_up" }
  ];

  targetValues = [16, 219, 2717, 2073];

  ngOnInit() {
    this.animateNumbers();
  }

  animateNumbers() {
    const duration = 17000; // 2 segundos para la animación
    const interval = 3; // Actualizar cada 20ms
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      this.stats[0].number = Math.floor(progress * this.targetValues[0]);
      this.stats[1].number = Math.floor(progress * this.targetValues[1]);
      this.stats[2].number = Math.floor(progress * this.targetValues[2]);
      this.stats[3].number = Math.floor(progress * this.targetValues[3]);
      
      if (progress === 1) {
        clearInterval(timer);
      }
    }, interval);
  }
}