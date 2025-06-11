import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-features',
    imports: [CommonModule],
    templateUrl: './features.component.html',
    styleUrl: './features.component.css'
})
export class FeaturesComponent {
  features = [
    {
      icon: 'fas fa-building',
      title: "Análisis de mercado",
      description: "Datos actualizados y análisis profundo del mercado inmobiliario local y nacional."
    },
    {
      icon: 'fas fa-chart-line',
      title: "Proyecciones financieras",
      description: "Herramientas avanzadas para calcular ROI y proyectar el crecimiento de tus inversiones."
    },
    {
      icon: 'fas fa-shield-alt',
      title: "Asesoría legal",
      description: "Orientación experta en regulaciones y trámites legales del sector inmobiliario."
    },
    {
      icon: 'fas fa-users',
      title: "Red de contactos",
      description: "Acceso a una amplia red de profesionales y oportunidades en el sector."
    }
  ];
}
