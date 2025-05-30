import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { environment } from '../../../../environments/environment';
//import { ApiService } from '../../services/api-service.service'; 
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 
import { UserMenuComponent } from '../user-menu.component';
import { SupabaseService } from '../../../services/supabase.service';
import { IaComponent } from '../../ia/ia.component';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, HttpClientModule, CommonModule, UserMenuComponent, IaComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  appName = environment.appName;
  data: any;
  mostrarCard = false;

  constructor(public supabaseService: SupabaseService) {} 

  ngOnInit() {
   
  }

  mostrarCardOn() {
    this.mostrarCard = true;
  }

  mostrarCardOff() {
    this.mostrarCard = false;
  }
}