import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-terminos',
    imports: [],
    templateUrl: './terminos.component.html',
    styleUrl: './terminos.component.css'
})
export class TerminosComponent {
  appName = environment.appName;
}
