import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PronosticoService } from '../../services/pronostico.service';

@Component({
  selector: 'app-ia',
  standalone: true,
  templateUrl: './ia.component.html',
  styleUrl: './ia.component.css',
  imports: [HttpClientModule, CommonModule, FormsModule]
})
export class IaComponent {
  ciudad: string = '';
  resultado: string = '';
  loading: boolean = false;

  constructor(private pronosticoService: PronosticoService) {}

  obtenerPronostico() {
    if (!this.ciudad) return;
    this.loading = true;
    this.resultado = '';
    this.pronosticoService.obtenerPronostico(this.ciudad).subscribe({
      next: (res: string) => {
        try {
          // Puede haber varias líneas, buscar todas las líneas con 'data:'
          const dataLines = res.split('\n').filter(line => line.startsWith('data: '));
          if (dataLines.length > 0) {
            // Tomar la última línea con data:
            const lastData = dataLines[dataLines.length - 1].replace('data: ', '');
            const data = JSON.parse(lastData);
            this.resultado = JSON.stringify(data.result.content[0].text, null, 2);
          } else {
            this.resultado = 'Respuesta inesperada';
          }
        } catch (e) {
          this.resultado = 'Error al procesar la respuesta';
        }
        this.loading = false;
      },
      error: (err) => {
        this.resultado = 'Error al obtener el pronóstico';
        this.loading = false;
      }
    });
  }
}
