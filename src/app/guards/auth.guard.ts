import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private supabaseService: SupabaseService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.supabaseService.user$.pipe(
      take(1),
      map(user => {
        if (!!user) {
          return true;
        } else {
          this.router.navigate(['/login'], { queryParams: { returnUrl: '/admin' } });
          return false;
        }
      })
    );
  }
}
