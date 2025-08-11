import { Component, OnInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { GeolocalizacionesService } from '../../services/geolocalizaciones.service';






// Icono azul celeste SVG embebido, igual para todos los marcadores
const celestePinSvg = `<svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
  <defs><filter id="shadow" x="-20%" y="-10%" width="140%" height="140%"><feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/><feOffset dy="1"/><feComponentTransfer><feFuncA type="linear" slope="0.4"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
  <path filter="url(#shadow)" fill="#2E7DFF" stroke="#114A99" stroke-width="2" d="M12.5 1C6.2 1 1 6.11 1 12.33c0 8.26 9.54 20.65 11.55 23.21.19.24.56.24.75 0 2-2.56 11.7-14.95 11.7-23.21C25 6.11 18.8 1 12.5 1Z"/>
  <circle cx="12.5" cy="12.5" r="5.2" fill="#fff" stroke="#114A99" stroke-width="1.5" />
</svg>`;

const celesteDivIcon = L.divIcon({
  className: 'leaflet-celeste-pin',
  html: celestePinSvg,
  iconSize: [25,41],
  iconAnchor: [12,41],
  tooltipAnchor: [0,-34]
});

function addMarkerToMap(map: L.Map, lat: number, lon: number) {
  L.marker([lat, lon], { zIndexOffset: 800, icon: celesteDivIcon })
    .addTo(map)
    .bindTooltip(`${lat.toFixed(5)}, ${lon.toFixed(5)}`, { direction: 'top', offset: [0, -12] });
}

@Component({
    selector: 'app-mapa',
    imports: [],
    templateUrl: './mapa.component.html',
    styleUrl: './mapa.component.css'
})
export class MapaComponent implements OnInit, OnDestroy {
    private map!: L.Map;
    public esriSat: any;
    public googleMaps: any;
    public googleHybrid: any;
    public osm2: any;
    public openmap: any;
    public argenMap: any;
    public wmsTerrestrisTopo: any;
    public wmsTerrestrisOsm: any;
    public esriTransportes: any;
    public googleSat: any;
    public osm: any;

    private unsubscribeGeoloc: (() => void) | null = null;

    constructor(private geolocSrv: GeolocalizacionesService) {}

    ngOnInit(): void {
      this.initMap();
      // Carga inicial de registros existentes
      this.geolocSrv.fetchExistingLocations().then(list => {
        list.forEach(g => addMarkerToMap(this.map, g.latitud, g.longitud));
      });
      // Suscripción realtime mínima a nuevas geolocalizaciones
      this.unsubscribeGeoloc = this.geolocSrv.subscribeToNewLocations(geo => {
        // Marcador con zIndex elevado para garantizar visibilidad sobre capas
        addMarkerToMap(this.map, geo.latitud, geo.longitud);
      });
    }

    ngOnDestroy(): void {
      if (this.unsubscribeGeoloc) {
        this.unsubscribeGeoloc();
      }
    }

  private initMap(): void {
    this.map = L.map('map').setView([-34.6037, -58.3816], 13); // Buenos Aires

    // Capa base de Google Satellite
    const googleSat = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      maxZoom: 21,
      attribution: '© Google Maps'
    });

    // Capa base de OpenStreetMap
    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 21,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    //-----------------------------------------------------------------
    this.googleHybrid = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
        maxZoom: 21,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        detectRetina: true
      });
      //-----------------------------------------------------------------
  
      //-----------------------------------------------------------------
      this.osm2 = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 21 });
      //-----------------------------------------------------------------
  
      //-----------------------------------------------------------------
      this.argenMap = L.tileLayer('https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png', {
        minZoom: 1, maxZoom: 21
      });
  
      //esri world topo map-----------------------------------------------------------------
      this.openmap = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}", {
        attribution: 'terms and feedback'
      });
      //-----------------------------------------------------------------
  
      //-----------------------------------------------------------------
      this.googleMaps = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 21,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        detectRetina: true
      });
      //-----------------------------------------------------------------
  
      //-----------------------------------------------------------------
      this.esriSat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 22 });
      //-----------------------------------------------------------------
  
      //-----------------------------------------------------------------
      this.esriTransportes = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}');
      //-----------------------------------------------------------------
  
      //-----------------------------------------------------------------
      //https://www.terrestris.de/en/
      this.wmsTerrestrisTopo = L.tileLayer.wms('https://ows.terrestris.de/osm/service?', { layers: 'TOPO-OSM-WMS' });
  
      this.wmsTerrestrisOsm = L.tileLayer.wms('https://ows.mundialis.de/services/service?', { layers: 'OSM-WMS' });
      //-----------------------------------------------------------------
  

    // Agregar Google Satellite por defecto
    googleSat.addTo(this.map);
    var baseMaps = {
        "OpenStreetMap": osm,
        "Google Satelital": googleSat,
        "Google Maps": this.googleMaps,
        "Google Híbrido": this.googleHybrid,
        "ESRI Satelital": this.esriSat,
        "ESRI Topo": this.openmap,
        "OpenStreetMap 2": this.osm2,
        "Terrestris OSM": this.wmsTerrestrisOsm,
        "Terrestris Topo": this.wmsTerrestrisTopo
    };
    
    var overlayMaps = {
        "Transportes": this.esriTransportes,
       
    };
    // Control de capas
    L.control.layers(baseMaps, overlayMaps).addTo(this.map);
   
  }
}
