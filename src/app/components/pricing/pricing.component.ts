import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-pricing',
    imports: [CommonModule],
    templateUrl: './pricing.component.html',
    styleUrl: './pricing.component.css'
})
export class PricingComponent {
  plans = [
    {
      name: "Básico",
      price: "$99/mes",
      features: [
        "Análisis de mercado básico",
        "Proyecciones financieras limitadas",
        "Acceso a recursos educativos",
        "Soporte por email"
      ]
    },
    {
      name: "Pro",
      price: "$299/mes",
      features: [
        "Análisis de mercado avanzado",
        "Proyecciones financieras completas",
        "Asesoría legal básica",
        "Acceso a red de contactos",
        "Soporte prioritario"
      ]
    },
    {
      name: "Empresarial",
      price: "Personalizado",
      features: [
        "Análisis de mercado personalizado",
        "Proyecciones financieras a medida",
        "Asesoría legal completa",
        "Acceso VIP a red de contactos",
        "Gerente de cuenta dedicado"
      ]
    }
  ];
}
