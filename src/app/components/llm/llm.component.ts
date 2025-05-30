import { Component } from '@angular/core';
import { LlmService } from '../../services/llm.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-llm',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './llm.component.html',
  styleUrl: './llm.component.css'
})
export class LlmComponent {
  resultado: string = '';
  inputData: string = '';
  loading: boolean = false;

  // parámetros por defecto para el request
  model: string = 'mistralai/mistral-7b-instruct:free';
  max_tokens: number = 10;
  role: string = 'user';
  providerSort: string = 'latency';

  constructor(private llmService: LlmService) {}

  async enviar() {
    this.loading = true;
    this.resultado = '';
    try {
      // Si el usuario no ingresa nada, enviar un objeto vacío
      let payload: any;
      if (
        !this.inputData &&
        !this.model &&
        !this.max_tokens &&
        !this.role &&
        !this.providerSort
      ) {
        payload = {};
      } else {
        payload = {
          model: this.model,
          messages: this.inputData ? [ { role: this.role, content: this.inputData } ] : undefined,
          provider: this.providerSort ? { sort: this.providerSort } : undefined,
          max_tokens: this.max_tokens || undefined
        };
        // Eliminar claves undefined
        Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);
      }
      const res: any = await this.llmService.postChat(payload);
      console.log('Respuesta completa:', res);
      if (res && typeof res === 'object') {
        this.resultado = `Modelo: ${res.model ?? 'N/A'}\nMensaje: ${res.message ?? JSON.stringify(res)}`;
      } else {
        this.resultado = JSON.stringify(res, null, 2);
      }
    } catch (error) {
      this.resultado = 'Error en la petición';
    }
    this.loading = false;
  }
}
