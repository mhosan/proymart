import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { environment } from '../../../environments/environment';
//import { ApiService } from '../../services/api-service.service'; 
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, HttpClientModule, CommonModule], 
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  appName = environment.appName;
  data: any;
  mostrarCard = false;

  //constructor(private apiService: ApiService) {} 

  ngOnInit() {
   
  }

 

  mostrarCardOn() {
    this.mostrarCard = true;
  }

  mostrarCardOff() {
    this.mostrarCard = false;
  }
}