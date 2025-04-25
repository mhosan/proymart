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
    ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map').setView([-34.6037, -58.3816], 13); // Buenos Aires

    // Capa base de Google Satellite
    const googleSat = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      maxZoom: 19,
      attribution: '© Google Maps'
    });

    // Capa base de OpenStreetMap
    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    // Agregar Google Satellite por defecto
    googleSat.addTo(this.map);

    // Control de capas
    L.control.layers({
      'Google Satellite': googleSat,
      'OpenStreetMap': osm
    }).addTo(this.map);
  }
}
