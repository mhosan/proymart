import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  email: string = '';
  password: string = '';
  isLogin: boolean = true;
  errorMessage: string = '';
  @Output() authSuccess = new EventEmitter<void>();

  constructor(private supabaseService: SupabaseService) {}

  async onSubmit() {
    try {
      if (this.isLogin) {
        await this.supabaseService.signIn(this.email, this.password);
      } else {
        await this.supabaseService.signUp(this.email, this.password);
      }
      this.errorMessage = '';
      this.authSuccess.emit(); // Emitir evento al autenticarse correctamente
    } catch (error: any) {
      if (
        error?.name === 'NavigatorLockAcquireTimeoutError' ||
        (typeof error?.message === 'string' && error.message.includes('Navigator LockManager'))
      ) {
        this.errorMessage = 'Error de sesión: otra pestaña o ventana está usando la autenticación. Cierra otras pestañas o espera unos segundos e inténtalo de nuevo.';
      } else {
        this.errorMessage = error.message;
      }
    }
  }

  toggleAuthMode(event: Event) {
    event.preventDefault();
    this.isLogin = !this.isLogin;
    this.errorMessage = '';
  }
}