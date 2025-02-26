import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-cta',
  standalone: true,
  imports: [ ],
  templateUrl: './cta.component.html',
  styleUrl: './cta.component.css'
})
export class CtaComponent implements OnInit{
  ngOnInit(): void {
    
  }
  appName = environment.appName;
  
}
