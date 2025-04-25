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
  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
    //const map = L.map('map').setView([-34.6037, -58.3816], 13); // Buenos Aires

    /* L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map); */

   /*  L.marker([-34.6037, -58.3816]).addTo(map)
      .bindPopup('Buenos Aires')
      .openPopup(); */
  }
}
