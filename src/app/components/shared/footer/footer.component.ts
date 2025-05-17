import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment'

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  appName = environment.appName;
}
