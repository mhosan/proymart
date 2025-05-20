import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { AuthComponent } from '../auth/auth.component';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';

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

  constructor(private supabaseService: SupabaseService) {
    // El estado de autenticación ahora se sincroniza con SupabaseService
  }

  ngOnInit() {
    this.supabaseService.user$.subscribe((user: any) => {
      this.autenticado = !!user;
      if (!user) {
        this.selectedUser = null;
      }
    });
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
    this.selectedUser = null;
    // Ya no es necesario recargar ni suscribirse de nuevo, el estado se sincroniza automáticamente.
  }

  logout() {
    // Método de logout deshabilitado: el logout ahora es centralizado desde el menú de usuario
    // this.autenticado = false;
    // localStorage.removeItem('autenticado');
  }
}
