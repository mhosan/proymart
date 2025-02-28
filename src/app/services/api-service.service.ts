import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = "https://fakestoreapi.com/users"; // -H "accept: application/json"; 

  constructor(private http: HttpClient) {}

  getData(headers?: HttpHeaders): Observable<any> {
    return this.http.get<any>(this.apiUrl, { headers });
  }

  postData(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/data`, data);
  }
}
