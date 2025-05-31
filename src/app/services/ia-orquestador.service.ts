import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IaOrquestadorService {
  private apiUrl = 'https://serverminimo.onrender.com/api/ia'; // Cambia esta URL si tu endpoint es diferente

  constructor(private http: HttpClient) {}

  obtenerResumenPronostico(ciudad: string): Observable<any> {
    return this.http.post(this.apiUrl, { ciudad });
  }
}
