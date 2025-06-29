import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Project } from '../models/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private tableName = 'projects';

  constructor(private supabaseService: SupabaseService) {}

  // Obtener todos los proyectos
  async getAll(): Promise<Project[]> {
    const data = await this.supabaseService.getDataFromTable(this.tableName);
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      start_date: item.start,
      end_date: item.end
    }));
  }

  // Obtener un proyecto por ID
  async getById(id: number): Promise<Project | null> {
    const data = await this.supabaseService.getDataFromTable(this.tableName);
    const project = data.find((item: any) => item.id === id);
    return project ? {
      id: project.id,
      name: project.name,
      start_date: project.start,
      end_date: project.end
    } : null;
  }

  // Insertar un nuevo proyecto
  async insert(project: Project): Promise<Project | null> {
    // Mapear a los nombres de columnas reales de la tabla
    const dbProject = {
      name: project.name,
      start: (project as any).start_date || (project as any).start,
      end: (project as any).end_date || (project as any).end
    };
    const insertedData = await this.supabaseService.insertIntoTable(this.tableName, dbProject);
    const inserted = Array.isArray(insertedData) ? insertedData[0] : null;
    return inserted ? {
      id: inserted.id,
      name: inserted.name,
      start_date: inserted.start,
      end_date: inserted.end
    } : null;
  }

  // Actualizar un proyecto existente
  async update(project: Project): Promise<Project | null> {
    if (!project.id) throw new Error('ID requerido para actualizar el proyecto');
    // Mapear a los nombres de columnas reales de la tabla
    const dbProject = {
      name: project.name,
      start: (project as any).start_date || (project as any).start,
      end: (project as any).end_date || (project as any).end
    };
    const updated = await this.supabaseService.updateTableById(this.tableName, project.id, dbProject);
    return updated ? {
      id: updated.id,
      name: updated.name,
      start_date: updated.start,
      end_date: updated.end
    } : null;
  }

  // Eliminar un proyecto por ID
  async remove(id: number): Promise<void> {
    await this.supabaseService.deleteFromTableById(this.tableName, id);
  }
}
