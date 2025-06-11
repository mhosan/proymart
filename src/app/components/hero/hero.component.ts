import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-hero',
    imports: [CommonModule],
    templateUrl: './hero.component.html',
    styleUrl: './hero.component.css'
})
export class HeroComponent {
  mostrarCard = false;

  mostrarAlerta() {
    this.mostrarCard = true;
  }

  cerrarCard() {
    this.mostrarCard = false;
  }
}
