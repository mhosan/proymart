import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../services/api-service.service'; 
import { HttpClientModule, HttpHeaders } from '@angular/common/http'; 


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, HttpClientModule], 
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  appName = environment.appName;
  data: any;

  constructor(private apiService: ApiService) {} 

  ngOnInit() {
   
  }

  testApi() {
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    this.apiService.getData(headers).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.error('Error al enviar los datos', error);
      }
    );
  }

}