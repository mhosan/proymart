import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class ResponsibleService {
  constructor(private supabaseService: SupabaseService) {}

  async getAll(): Promise<{ id: number, nombre: string, apellido: string, email: string, telefono: string }[]> {
    const data = await this.supabaseService.getDataFromTable('responsible');
    return data.map((item: any) => ({
      id: item.id,
      nombre: item.nombre,
      apellido: item.apellido,
      email: item.email,
      telefono: item.telefono
    }));
  }
}
