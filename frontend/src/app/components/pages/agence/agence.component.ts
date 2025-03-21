import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import { Agence, Gouvernorat } from '../../models/agence';
import { AgenceService } from '../../services/agence.service';
import { Observable, from } from 'rxjs';
import { concatMap, delay, map } from 'rxjs/operators';


interface GeocodingResult {
  agence: Agence;
  geocodeData: any[];
}

interface GouvernoratCoordinates {
  [key: string]: [number, number];
}
@Component({
  selector: 'app-agence',
  templateUrl: './agence.component.html',
  styleUrl: './agence.component.scss'
})
export class AgenceComponent {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  map!: Map;



  gouvernorats = Object.values(Gouvernorat);
  agences: Agence[] = [];

  constructor(private agenceService: AgenceService) {} // Injection du service



  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap() {
    this.map = new Map({
      target: this.mapContainer.nativeElement,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat([10.1658, 36.8065]), // Centrer sur Tunis
        zoom: 6
      })
    });
  }

  onGouvernoratChange(event: any) {
    const selectedGouvernorat = event.target.value as Gouvernorat;
    if (Object.values(Gouvernorat).includes(selectedGouvernorat)) {
      console.log('Gouvernorat sélectionné:', selectedGouvernorat);
      this.getAgencesByGouvernorat(selectedGouvernorat);
    } else {
      console.warn("Valeur de gouvernorat invalide:", selectedGouvernorat);
    }
  }
  
  
  

  private gouvernoratCoords: GouvernoratCoordinates = {
    'Béja': [9.1811, 36.7333],
    'Tunis': [10.1658, 36.8065],
    'Ariana': [10.1933, 36.8625],
    'Ben Arous': [10.2333, 36.7533],
    'Bizerte': [9.8642, 37.2744],
    'Gabès': [10.1000, 33.8881],
    'Gafsa': [8.7847, 34.4250],
    'Jendouba': [8.7808, 36.5014],
    'Kairouan': [10.0964, 35.6781],
    'Kasserine': [8.8369, 35.1667],
    'Kébili': [8.9692, 33.7050],
    'Le Kef': [8.7047, 36.1794],
    'Mahdia': [11.0622, 35.5047],
    'La Manouba': [10.0986, 36.8397],
    'Médenine': [10.4911, 33.3547],
    'Monastir': [10.8167, 35.7783],
    'Nabeul': [10.7350, 36.4514],
    'Sfax': [10.7600, 34.7400],
    'Sidi Bouzid': [9.4850, 35.0381],
    'Siliana': [9.3708, 36.0844],
    'Sousse': [10.6408, 35.8258],
    'Tataouine': [10.4518, 32.9297],
    'Tozeur': [8.1336, 33.9197],
    'Zaghouan': [10.1433, 36.4028]
  };

  private gouvernoratZoomLevels: { [key in Gouvernorat]?: number } = {
    "Béja": 13,
    "Médenine": 9,
    // Ajoutez les niveaux de zoom pour les autres gouvernorats...
  };

  getAgencesByGouvernorat(gouvernorat: Gouvernorat) {
    this.agenceService.getAgenceByGouvernorat(gouvernorat)
      .subscribe(data => {
        this.agences = data.map(item => new Agence(
          item['_id'],
          item['nom'],
          item['chefAgence'],
          item['email'],
          item['numero'],
          item['adresse'],
          item['gouvernorat']
        ));
        
        // Zoomer sur le gouvernorat sélectionné
        this.zoomToGouvernorat(gouvernorat);
        // Mettre à jour les marqueurs
        this.updateMapMarkers();
      });
  }

  zoomToGouvernorat(gouvernorat: Gouvernorat) {
    const coords = this.gouvernoratCoords[gouvernorat];
    const zoomLevel = this.gouvernoratZoomLevels[gouvernorat] || 10;
    
    if (coords) {
      this.map.getView().animate({
        center: fromLonLat(coords),
        zoom: zoomLevel,
        duration: 1000
      });
    }
  }

  updateMapMarkers() {
    // Supprimer les anciens marqueurs
    const layers = this.map.getLayers();
    layers.forEach(layer => {
      if (layer instanceof VectorLayer) {
        this.map.removeLayer(layer);
      }
    });
  
    const vectorSource = new VectorSource();
  
    // Créer un Observable avec les bonnes propriétés
    const agencesObservable = from(this.agences).pipe(
      concatMap((agence: Agence) => {
        const adresseComplete = `${agence.Adresse}, ${agence.Gouvernorat}, Tunisie`; // Utilisation de l'adresse complète
        return this.agenceService.geocode(adresseComplete).pipe(
          delay(1000), // Délai pour respecter les limites de l'API
          map((geocodeData: any[]) => {
            const lon = parseFloat(geocodeData[0]?.lon || '10.1658');  // Longitude par défaut (Tunis)
            const lat = parseFloat(geocodeData[0]?.lat || '36.8065');  // Latitude par défaut (Tunis)
            return { coords: [lon, lat], adresse: agence.Adresse };
          })
        );
      })
    );
  
    // S'abonner à l'Observable
    agencesObservable.subscribe({
      next: (result) => {
        const [lon, lat] = result.coords;
  
        // Débogage pour vérifier les coordonnées
        console.log(`Adresse: ${result.adresse}`);
        console.log(`Coordonnées géographiques : Lon: ${lon}, Lat: ${lat}`);
  
        // Conversion des coordonnées géographiques en coordonnées OpenLayers
        const coords = [lon, lat];
  
        // Créer un marqueur à la position spécifiée
        const feature = new Feature({
          geometry: new Point(fromLonLat(coords))  // Convertir les coordonnées géographiques en coordonnées de la carte
        });
  
        // Appliquer un style d'icône
        feature.setStyle(new Style({
          image: new Icon({
            src: '../../../../assets/img/marker.png',
            scale: 0.12  // Ajuster la taille de l'icône si nécessaire
          })
        }));
  
        // Ajouter la feature à la source
        vectorSource.addFeature(feature);
        console.log(`Marqueur ajouté pour l'adresse ${result.adresse} à ${coords}`);
      },
      error: (error: any) => {
        console.error('Erreur lors de l\'ajout des marqueurs:', error);
      },
      complete: () => {
        const vectorLayer = new VectorLayer({
          source: vectorSource
        });
        this.map.addLayer(vectorLayer);
        console.log('Tous les marqueurs ont été ajoutés.');
      }
    });
  }
  
  

  
  
  
  
}