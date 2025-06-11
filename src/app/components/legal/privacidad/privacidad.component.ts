import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-privacidad',
    imports: [],
    templateUrl: './privacidad.component.html',
    styleUrl: './privacidad.component.css'
})
export class PrivacidadComponent {
  appName = environment.appName;
}
