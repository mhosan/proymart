import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IaOrquestadorService } from '../../services/ia-orquestador.service';

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

  constructor(private iaOrquestadorService: IaOrquestadorService) {}

  obtenerPronostico() {
    if (!this.ciudad) return;
    this.loading = true;
    this.resultado = '';
    this.iaOrquestadorService.obtenerResumenPronostico(this.ciudad).subscribe({
      next: (res) => {
        // Puedes ajustar el formato según la respuesta de tu backend
        this.resultado = typeof res === 'object' ? JSON.stringify(res, null, 2) : res;
        this.loading = false;
      },
      error: (err) => {
        this.resultado = 'Error al obtener el pronóstico';
        this.loading = false;
      }
    });
  }
}
