import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PronosticoService {
  private apiUrl = 'https://mcpserver-hazel.vercel.app/api';

  constructor(private http: HttpClient) {}

  obtenerPronostico(ciudad: string): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'application/json, text/event-stream',
      'Content-Type': 'application/json'
    });
    const body = {
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'pronostico',
        arguments: {
          city: ciudad
        }
      },
      id: 1
    };
    return this.http.post(this.apiUrl, body, { headers, responseType: 'text' });
  }
}
