import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { AuthComponent } from '../auth/auth.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [NgIf, AuthComponent, CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  autenticado: boolean = false;
  users: any[] = [
    { id: 1, name: 'User 1', age: 20 },
    { id: 2, name: 'User 2', age: 21 },
    { id: 3, name: 'User 3', age: 22 },
  ];
  selectedUser: any = null;

  constructor() {
    // Al iniciar, revisa si el usuario ya está autenticado
    const authFlag = localStorage.getItem('autenticado');
    this.autenticado = authFlag === 'true';
  }

  fetchUsers() {
    // fetch users from the server
  }

  selectUser(user: any): void {
    this.users.forEach(u => {
      u.selected = false;
    });
    user.selected = true;
    this.selectedUser = user;
  }

  onAuthSuccess() {
    this.autenticado = true;
    localStorage.setItem('autenticado', 'true');
  }

  logout() {
    this.autenticado = false;
    localStorage.removeItem('autenticado');
  }
}
