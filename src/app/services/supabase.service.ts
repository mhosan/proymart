import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js'
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );

    // Listen for auth changes
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.userSubject.next(session?.user ?? null);
    });

    // Check for existing session
    this.supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      this.userSubject.next(session?.user ?? null);
    });
  }

  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password
    });
    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    // Borra todas las claves de sesión de Supabase en localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
        localStorage.removeItem(key);
      }
    });
    this.userSubject.next(null);
    if (error) throw error;
  }

  /*****************************************************************
   * Obtener datos desde la bd Postgres en Supabase.
   * @param tableName 
   * @returns 
   * 17/06/25
   ****************************************************************/
  async getDataFromTable(tableName: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from(tableName)
      .select('*'); // Selecciona todas las columnas

    if (error) {
      console.error(`Error fetching data from ${tableName}:`, error);
      throw error;
    }

    return data;
  }

  /*****************************************************************
   * Insertar un nuevo registro en una tabla.
   * @param tableName - El nombre de la tabla.
   * @param data - El objeto de datos a insertar.
   * @returns El registro insertado o null en caso de error (aunque se lanza excepción).
   ****************************************************************/
  async insertIntoTable(tableName: string, data: any): Promise<any | null> {
    const { data: insertedData, error } = await this.supabase
      .from(tableName)
      .insert(data) // Eliminar .select().single() aquí
      .select(); // Usamos .select() al final para que retorne el/los registro/s insertado/s.

    if (error) {
      console.error(`Error inserting data into ${tableName}:`, error);
      //throw error; // Lanza el error para que el servicio que llama lo maneje
    }
    return insertedData;
  }

  /*****************************************************************
   * Actualizar un registro existente en una tabla por su ID.
   * @param tableName - El nombre de la tabla.
   * @param id - El ID del registro a actualizar.
   * @param data - El objeto de datos con las actualizaciones.
   * @returns El registro actualizado o null en caso de error (aunque se lanza excepción).
   ****************************************************************/
  async updateTableById(tableName: string, id: number | string, data: any): Promise<any | null> {
    const { data: updatedData, error } = await this.supabase
      .from(tableName)
      .update(data)
      .eq('id', id) // Condición para encontrar el registro por ID
      .select()
      .single(); // Asumimos que actualizas un solo registro y quieres retornarlo

    if (error) {
      console.error(`Error updating data in ${tableName} with id ${id}:`, error);
      throw error; // Lanza el error
    }

    return updatedData; // Retorna el registro actualizado
  }

  /*****************************************************************
   * Eliminar un registro de una tabla por su ID.
   * @param tableName - El nombre de la tabla.
   * @param id - El ID del registro a eliminar.
   * @returns Void si la eliminación es exitosa, o lanza una excepción en caso de error.
   ****************************************************************/
  async deleteFromTableById(tableName: string, id: number | string): Promise<void> {
    const { error } = await this.supabase
      .from(tableName)
      .delete()
      .eq('id', id); // Condición para encontrar y eliminar el registro por ID

    if (error) {
      console.error(`Error deleting data from ${tableName} with id ${id}:`, error);
      throw error; // Lanza el error
    }

    // No hay datos de retorno en una eliminación exitosa según la operación común
  }
}