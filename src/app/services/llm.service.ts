import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LlmService {
  constructor(private http: HttpClient) { }

  async postChat(data: any): Promise<any> {
    try {
      const response = await this.http.post('https://serverminimo.onrender.com/api/chat', data).toPromise();
      return response;
    } catch (error) {
      console.error('Error en la petición:', error);
      throw error;
    }
  }
}
