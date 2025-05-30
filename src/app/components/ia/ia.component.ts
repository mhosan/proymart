import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PronosticoService } from '../../services/pronostico.service';
import { LlmService } from '../../services/llm.service';

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

  constructor(
    private pronosticoService: PronosticoService,
    private llmService: LlmService
  ) {}

  async obtenerPronostico() {
    if (!this.ciudad) return;
    this.loading = true;
    this.resultado = '';
    this.pronosticoService.obtenerPronostico(this.ciudad).subscribe({
      next: async (res: string) => {
        try {
          const dataLines = res.split('\n').filter(line => line.startsWith('data: '));
          if (dataLines.length > 0) {
            const lastData = dataLines[dataLines.length - 1].replace('data: ', '');
            const data = JSON.parse(lastData);
            const pronostico = JSON.stringify(data.result.content[0].text, null, 2);
            // Enviar al LLM la consulta con el pronóstico recibido
            const prompt = `Dame un resumen del pronóstico del tiempo para la ciudad de ${this.ciudad} con estos datos: ${pronostico}`;
            const payload = {
              model: 'mistralai/mistral-7b-instruct:free',
              messages: [ { role: 'user', content: prompt } ],
              provider: { sort: 'latency' },
              max_tokens: 100
            };
            const llmRes: any = await this.llmService.postChat(payload);
            if (llmRes && typeof llmRes === 'object') {
              this.resultado = `Modelo: ${llmRes.model ?? 'N/A'}\nMensaje: ${llmRes.message ?? JSON.stringify(llmRes)}`;
            } else {
              this.resultado = JSON.stringify(llmRes, null, 2);
            }
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
