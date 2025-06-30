import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Project } from '../models/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private tableName = 'projects';

  constructor(private supabaseService: SupabaseService) {}

  /*************************************************************************
   * Formatea una cadena de fecha o un objeto Date al formato YYYY-MM-DD.
   * Si la fecha es una cadena, se espera que esté en formato ISO o similar.
   * Si es un objeto Date, se convierte al formato YYYY-MM-DD.
   * @param dateString - La cadena de fecha o el objeto Date a formatear.
   * @returns La fecha formateada como cadena en formato YYYY-MM-DD.
   ************************************************************************/
  private formatDateString(dateString: string | Date): string {
    if (!dateString) return '';
    if (typeof dateString === 'string') {
      return dateString.split('T')[0].split(' ')[0];
    }
    if (dateString instanceof Date) {
      const year = dateString.getFullYear();
      const month = (dateString.getMonth() + 1).toString().padStart(2, '0');
      const day = dateString.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return '';
  }

  // Obtener todos los proyectos
  async getAll(): Promise<Project[]> {
    const data = await this.supabaseService.getDataFromTable(this.tableName);
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      start_date: this.formatDateString(item.start),
      end_date: this.formatDateString(item.end)
    }));
  }

  // Obtener un proyecto por ID
  async getById(id: number): Promise<Project | null> {
    const data = await this.supabaseService.getDataFromTable(this.tableName);
    const project = data.find((item: any) => item.id === id);
    return project ? {
      id: project.id,
      name: project.name,
      start_date: this.formatDateString(project.start),
      end_date: this.formatDateString(project.end)
    } : null;
  }

  // Insertar un nuevo proyecto
  async insert(project: Project): Promise<Project | null> {
    // Mapear a los nombres de columnas reales de la tabla, asegurando formato YYYY-MM-DD
    const dbProject = {
      name: project.name,
      start: this.formatDateString((project as any).start_date || (project as any).start),
      end: this.formatDateString((project as any).end_date || (project as any).end)
    };
    const insertedData = await this.supabaseService.insertIntoTable(this.tableName, dbProject);
    const inserted = Array.isArray(insertedData) ? insertedData[0] : null;
    return inserted ? {
      id: inserted.id,
      name: inserted.name,
      start_date: this.formatDateString(inserted.start),
      end_date: this.formatDateString(inserted.end)
    } : null;
  }

  // Actualizar un proyecto existente
  async update(project: Project): Promise<Project | null> {
    if (!project.id) throw new Error('ID requerido para actualizar el proyecto');
    // Mapear a los nombres de columnas reales de la tabla, asegurando formato YYYY-MM-DD
    const dbProject = {
      name: project.name,
      start: this.formatDateString((project as any).start_date || (project as any).start),
      end: this.formatDateString((project as any).end_date || (project as any).end)
    };
    const updated = await this.supabaseService.updateTableById(this.tableName, project.id, dbProject);
    return updated ? {
      id: updated.id,
      name: updated.name,
      start_date: this.formatDateString(updated.start),
      end_date: this.formatDateString(updated.end)
    } : null;
  }

  // Eliminar un proyecto por ID
  async remove(id: number): Promise<void> {
    await this.supabaseService.deleteFromTableById(this.tableName, id);
  }
}
