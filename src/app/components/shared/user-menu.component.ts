import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupabaseService } from '../../services/supabase.service';
import { AuthComponent } from '../auth/auth.component';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  template: `
    <div class="dropdown">
      <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" id="userMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
        Usuario
      </button>
      <ul class="dropdown-menu" aria-labelledby="userMenuButton">
        <li><a class="dropdown-item" href="#" (click)="onSignIn()">Sign In</a></li>
        <li><a class="dropdown-item" href="#" (click)="onSignUp()">Sign Up</a></li>
        <li *ngIf="(supabaseService.user$ | async) as user"><a class="dropdown-item" href="#" (click)="onLogout()">Logout</a></li>
      </ul>
    </div>
    <div *ngIf="showAuth" class="modal-backdrop show" style="z-index: 1050;"></div>
    <div *ngIf="showAuth" class="modal d-block" tabindex="-1" style="z-index: 1060;">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isLogin ? 'Iniciar sesión' : 'Crear cuenta' }}</h5>
            <button type="button" class="btn-close" (click)="showAuth = false"></button>
          </div>
          <div class="modal-body">
            <app-auth (authSuccess)="onAuthSuccess()" [isLogin]="isLogin"></app-auth>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [``],
  imports: [CommonModule, AuthComponent],
})
export class UserMenuComponent {
  showAuth = false;
  isLogin = true;

  constructor(public supabaseService: SupabaseService) {}

  onSignIn() {
    this.isLogin = true;
    this.showAuth = true;
  }
  onSignUp() {
    this.isLogin = false;
    this.showAuth = true;
  }
  async onLogout() {
    await this.supabaseService.signOut();
    window.location.reload(); // Fuerza recarga para limpiar cualquier estado residual
  }
  onAuthSuccess() {
    this.showAuth = false;
  }
}
