import { Component } from '@angular/core';
import { Actualite } from '../../models/actualite';
import { ActualiteService } from '../../services/actualite.service';


@Component({
  selector: 'app-actualites',
  templateUrl: './actualites.component.html',
  styleUrl: './actualites.component.scss'
})
export class ActualitesComponent {
  actualites: Actualite[] = [];

  constructor(
    private actualiteService: ActualiteService,
  ) { }

  ngOnInit(): void {
      this.getAllActualites()

  }

// actualite.component.ts
getAllActualites(): void {
  this.actualiteService.getActualite().subscribe(
    actualites => {
      console.log('Données brutes:', actualites); // Pour déboguer
      this.actualites = actualites.map(act => new Actualite(
        act.Id,
        act.Nom,
        act.Description,
        act.Image
      ));
      console.log('Données transformées:', this.actualites); // Pour déboguer
    },
    error => {
      console.error('Erreur:', error);
    }
  );
}


  getImageUrl(imageName?: string): string {
    if (imageName && !imageName.startsWith('assets/')) {
      // Si l'image provient de la base de données, on utilise une URL spécifique
      return `${imageName}`;
    }
    // Sinon, elle est dans les assets (statique)
    return imageName ? imageName : '';
  }
}
