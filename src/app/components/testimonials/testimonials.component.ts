import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css'
})
export class TestimonialsComponent {
  testimonials = [
    {
      quote: "PropTech Advisors transformó nuestra estrategia de inversión. Sus insights nos ayudaron a identificar oportunidades que otros pasaron por alto.",
      author: "María Rodríguez",
      company: "Inversiones MR"
    },
    {
      quote: "El análisis de mercado de PropTech es insuperable. Nos ha permitido tomar decisiones informadas y aumentar nuestro ROI significativamente.",
      author: "Carlos Mendoza",
      company: "Desarrollos Urbanos CM"
    },
    {
      quote: "La asesoría legal de PropTech nos ahorró tiempo y dolores de cabeza. Su equipo es verdaderamente experto en el sector inmobiliario.",
      author: "Ana Gómez",
      company: "Constructora AG"
    }
  ];
}
