import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment'

@Component({
    selector: 'app-testimonials',
    imports: [CommonModule],
    templateUrl: './testimonials.component.html',
    styleUrl: './testimonials.component.css'
})
export class TestimonialsComponent {
  appName = environment.appName;
  testimonials = [
    {
      quote: this.appName + " transformó nuestra estrategia de inversión. Sus insights nos ayudaron a identificar oportunidades que otros pasaron por alto.",
      author: "María Rodríguez",
      company: "Inversiones MR"
    },
    {
      quote: "El análisis de mercado de " + this.appName + " es insuperable. Nos ha permitido tomar decisiones informadas y aumentar nuestro ROI significativamente.",
      author: "Carlos Mendoza",
      company: "Desarrollos Urbanos CM"
    },
    {
      quote: "La asesoría legal de " + this.appName + " nos ahorró tiempo y dolores de cabeza. Su equipo es verdaderamente experto en el sector inmobiliario.",
      author: "Ana Gómez",
      company: "Constructora AG"
    }
  ];
}
