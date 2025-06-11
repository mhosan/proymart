import { Component } from '@angular/core';
import { AuthComponent } from './auth.component';

@Component({
    selector: 'app-login-page',
    imports: [AuthComponent],
    template: `
    <div class="container py-5">
      <h2>Iniciar sesión</h2>
      <app-auth (authSuccess)="onAuthSuccess()" [isLogin]="true"></app-auth>
    </div>
  `
})
export class LoginPageComponent {
  onAuthSuccess() {
    // Redirigir a la página original si corresponde
    const params = new URLSearchParams(window.location.search);
    const returnUrl = params.get('returnUrl') || '/admin';
    window.location.href = returnUrl;
  }
}
