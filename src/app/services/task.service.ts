import { Injectable } from '@angular/core';
import { Task } from '../models/task';
import { HandleError } from '../services/service-helper.ts';
import { SupabaseService } from '../services/supabase.service';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private supabaseService: SupabaseService) { }

  // Método auxiliar para formatear fechas al formato de Gantt
  private formatDateForGantt(dateString: string | Date): string {
    if (!dateString) return "";

    const date = (dateString instanceof Date) ? dateString : new Date(dateString);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() es 0-indexed
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  /****************************************************************************
   * Obtiene todas las tareas de la base de datos.
   * @returns Una lista de objetos Task.
   ***************************************************************************/
  async get(): Promise<Task[]> {
    try {
      const data = await this.supabaseService.getDataFromTable('task');
      const transformedData: Task[] = data.map((item: any) => ({
        id: item.id,
        text: item.text,
        start_date: this.formatDateForGantt(item.start_date),
        duration: item.duration,
        progress: item.progress || 0,
        parent: item.parent || 0,
        priority: item.priority,
        users: item.users,
        type: item.type,
        project_id: item.idProject // Usar el campo correcto de la base de datos
      }));
      console.log('TaskService.get() data from Supabase (transformed):', transformedData);
      return transformedData;
    } catch (error) {
      console.error('Error fetching tasks from Supabase:', error);
      HandleError(error);
      throw error; // Re-lanza el error para que el componente Gantt lo pueda manejar
    }
  }

  /****************************************************************************
   * Inserta una nueva tarea en la base de datos.
   * @param task Objeto de tarea a insertar.
   * @returns La tarea insertada con el ID asignado por la base de datos.
   ***************************************************************************/
  async insert(task: Task): Promise<Task> {
    try {
      console.log('Objeto de tarea antes de limpiar y mapear:', task);
      // Clonar el objeto tarea para no modificar el original
      const taskToInsert: any = { ...task };

      // Eliminar propiedades internas de dhtmlxGantt y 'end_date' antes de insertar
      delete taskToInsert['!nativeeditor_status'];
      delete taskToInsert['!nativeeditor_id'];
      delete taskToInsert['end_date'];

      // Mapear project_id a idProject para la base de datos
      if (taskToInsert.project_id) {
        taskToInsert.idProject = taskToInsert.project_id;
        delete taskToInsert.project_id;
      }

      // Ensure users is an array of integers
      if (taskToInsert.users !== null && taskToInsert.users !== undefined) {
        if (!Array.isArray(taskToInsert.users)) {
          // If it's not an array, wrap it in an array
          taskToInsert.users = [taskToInsert.users];
        }
        // Ensure all elements in the array are integers (optional, but good practice)
        taskToInsert.users = taskToInsert.users.map((userId: any) => parseInt(userId, 10)).filter((userId: number) => !isNaN(userId));
      } else {
        // If users is null or undefined, set it to an empty array
        taskToInsert.users = [];
      }

      console.log('Objeto de tarea FINAL que se enviará a Supabase:', taskToInsert);
      const insertedTask = await this.supabaseService.insertIntoTable('task', taskToInsert);

      // Después de insertar, dhtmlxGantt espera el objeto retornado con el nuevo ID asignado por la BD
      // y los IDs temporales/nativos.
      // Nos aseguramos de que el objeto retornado incluya las propiedades nativas si la inserción fue exitosa
      if (insertedTask) {
        // Copiar propiedades nativas del objeto original 'task' al objeto insertado retornado
        if (task.hasOwnProperty('!nativeeditor_status')) {
          (insertedTask as any)['!nativeeditor_status'] = (task as any)['!nativeeditor_status'];
        }
        if (task.hasOwnProperty('!nativeeditor_id')) {
          (insertedTask as any)['!nativeeditor_id'] = (task as any)['!nativeeditor_id'];
        }

        // Formatear la fecha si es necesario para la respuesta
        if (insertedTask.start_date) {
          insertedTask.start_date = this.formatDateForGantt(insertedTask.start_date);
        }
      }

      return insertedTask as Task;
    } catch (error) {
      console.error('Error inserting task into Supabase:', error);
      HandleError(error);
      throw error;
    }
  }

  /****************************************************************************
   * Actualiza una tarea existente en la base de datos.
   * @param task Objeto de tarea a actualizar.
   * @returns void
   ***************************************************************************/
  async update(task: Task): Promise<void> {
    try {
      const taskToSend: any = { ...task }; // Crea una copia para no modificar el objeto original si es necesario

      // Eliminar propiedades internas de dhtmlxGantt antes de actualizar
      delete taskToSend['!nativeeditor_status'];
      delete taskToSend['!nativeeditor_id']; // Eliminar la propiedad específica (si existe)
      delete taskToSend['end_date']; // Eliminar la propiedad end_date

      // Asegurarse de que 'users' sea un array si existe y no es null/undefined
      if (taskToSend.users !== null && taskToSend.users !== undefined) {
        if (!Array.isArray(taskToSend.users)) {
          // Si no es un array, envolverlo en un array
          taskToSend.users = [taskToSend.users];
        }
        // Asegurarse de que todos los elementos en el array sean enteros (opcional, pero buena práctica)
        taskToSend.users = taskToSend.users.map((userId: any) => parseInt(userId, 10)).filter((userId: number) => !isNaN(userId));
      } else {
        // Si users es null o undefined, establecerlo a un array vacío para evitar errores en la BD
        taskToSend.users = [];
      }

      await this.supabaseService.updateTableById('task', taskToSend.id, taskToSend);
    } catch (error) {
      console.error(`Error updating task with id ${task.id} in Supabase:`, error);
      HandleError(error);
      throw error; // Re-lanza el error
    }
  }

  /****************************************************************************
   * Elimina una tarea de la base de datos por su ID.
   * @param id ID de la tarea a eliminar.
   * @returns void
   ***************************************************************************/ 
  async remove(id: number): Promise<void> {
    try {
      await this.supabaseService.deleteFromTableById('task', id);
    } catch (error) {
      console.error(`Error deleting task with id ${id} from Supabase:`, error);
      HandleError(error);
      throw error; // Re-lanza el error
    }
  }

}
