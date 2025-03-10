import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavComponent {
  // Solo este método para verificar si está logueado
  isLoggedIn(): boolean {
    return localStorage.getItem("login") === 'true';
  }
}