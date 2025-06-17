import { Injectable } from '@angular/core';
import { Link } from '../models/link';
import { HandleError } from '../services/service-helper.ts';
import { SupabaseService } from '../services/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class LinkService {
  constructor(private supabaseService: SupabaseService) { }

  async get(): Promise<Link[]> {
    try {
      const data = await this.supabaseService.getDataFromTable('link');
      const transformedData: Link[] = data.map((item: any) => ({
        id: item.id, 
        source: item.source,
        target: item.target,
        type: item.type 
      }));

      console.log('LinkService.get() data from Supabase (transformed):', transformedData);
      return transformedData;

    } catch (error) {
      console.error('Error fetching links from Supabase:', error);
      HandleError(error);
      throw error; // Re-lanza el error
    }
  }


  async insert(link: Link): Promise<Link> {
    try {
      const insertedLink = await this.supabaseService.insertIntoTable('link', link);
      return insertedLink as Link; 
    } catch (error) {
      console.error('Error inserting link into Supabase:', error);
      HandleError(error); 
      throw error; // Re-lanza el error
    }
  }


  async update(link: Link): Promise<void> {
    try {
      await this.supabaseService.updateTableById('link', link.id, link);
    } catch (error) {
      console.error(`Error updating link with id ${link.id} in Supabase:`, error);
      HandleError(error); 
      throw error; // Re-lanza el error
    }
  }


  async remove(id: number): Promise<void> {
    try {
      await this.supabaseService.deleteFromTableById('link', id);
    } catch (error) {
      console.error(`Error deleting link with id ${id} from Supabase:`, error);
      HandleError(error); 
      throw error; // Re-lanza el error
    }
  }

}
