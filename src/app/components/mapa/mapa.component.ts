import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

/* const baseHref = document.getElementsByTagName('base')[0]?.getAttribute('href') || '/';
const normalizedBaseHref = baseHref.endsWith('/') ? baseHref : baseHref + '/';
const leafletAssets = `${normalizedBaseHref}assets/leaflet/`;
(L.Icon.Default as any).mergeOptions({
  iconRetinaUrl: `${leafletAssets}marker-icon-2x.png`,
  iconUrl: `${leafletAssets}marker-icon.png`,
  shadowUrl: `${leafletAssets}marker-shadow.png`
}); */

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [],
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.css'
})
export class MapaComponent implements OnInit {
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

    ngOnInit(): void {
    this.initMap();
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
