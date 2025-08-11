import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export interface Geolocalizacion {
  id?: number;
  latitud: number;
  longitud: number;
  // Otros campos posibles se ignoran para este feature mínimo
}

@Injectable({ providedIn: 'root' })
export class GeolocalizacionesService {
  private supabase: SupabaseClient;
  private channelInitialized = false;
  private unsubscribeFn: (() => void) | null = null;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
  }

  /** Carga inicial de todas las geolocalizaciones existentes (solo id, latitud, longitud). */
  async fetchExistingLocations(): Promise<Geolocalizacion[]> {
    const { data, error } = await this.supabase
      .from('geolocalizaciones')
      .select('id,latitud,longitud');
    if (error) return [];
    return (data || [])
      .map(r => ({
        id: r.id,
        latitud: typeof r.latitud === 'number' ? r.latitud : parseFloat(r.latitud),
        longitud: typeof r.longitud === 'number' ? r.longitud : parseFloat(r.longitud)
      }))
      .filter(g => !Number.isNaN(g.latitud) && !Number.isNaN(g.longitud));
  }

  /**
   * Se suscribe a INSERT en public.geolocalizaciones y ejecuta el handler con la nueva fila.
   * Devuelve una función para cancelar la suscripción.
   */
  subscribeToNewLocations(handler: (geo: Geolocalizacion) => void): () => void {
    if (this.channelInitialized) {
      // Ya existe una suscripción activa, devolvemos la función existente
      return this.unsubscribeFn || (() => {});
    }

    const channel = this.supabase
      .channel('realtime:public:geolocalizaciones:insert')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'geolocalizaciones' },
        (payload) => {
          const record: any = payload.new;
          // Mínimo chequeo: existan campos numéricos latitud / longitud
          if (record) {
            const latRaw = record.latitud;
            const lonRaw = record.longitud;
            const lat = typeof latRaw === 'number' ? latRaw : parseFloat(latRaw);
            const lon = typeof lonRaw === 'number' ? lonRaw : parseFloat(lonRaw);
            if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
              handler({ latitud: lat, longitud: lon, id: record.id });
            }
          }
        }
      )
      .subscribe();

    this.channelInitialized = true;
    this.unsubscribeFn = () => {
      channel.unsubscribe();
      this.channelInitialized = false;
      this.unsubscribeFn = null;
    };

    return this.unsubscribeFn;
  }
}
