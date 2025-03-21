import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Voiture } from 'src/app/components/models/voiture';
import { VoitureService } from 'src/app/components/services/voiture.service';

@Component({
  selector: 'app-voiture',
  templateUrl: './voiture.component.html',
  styleUrl: './voiture.component.scss'
})
export class VoitureComponent {
  displayModal: boolean = false; // Contrôle la visibilité du modal

  voitureDialog: boolean = false;
  actionLabel: string = 'Enregistrer';
  deleteVoitureDialog: boolean = false;
  voitures: Voiture[] = [];
  voiture!: Voiture

  selectedVoitures: Voiture[] = [];
  voitureImageUrl!: string; // Déclaration de l'URL de l'image du voiture

  submitted: boolean = false;

  cols: any[] = [];
  rowsPerPageOptions = [5, 10, 20];


  constructor(
    private voitureService: VoitureService,
    private messageService: MessageService,
  ) {}
  
    ngOnInit() {
      this.voiture = new Voiture('', 0, '', '', 0, '');
      this.getAllVoitures();

    }

  openNew() {
    this.voiture = new Voiture('', 0, '', '', 0, '');

    this.submitted = false;
    this.voitureDialog = true;
    this.actionLabel = 'Enregistrer';

  }

  editVoiture(voiture: any) {
    const voitureInstance = new Voiture(
      voiture._id,
      voiture.puissance_fiscale,
      voiture.marque,
      voiture.modele,
      voiture.nbr_portes,
      voiture.num_chas
    );
    if (voitureInstance && voitureInstance.Id) {
      this.voitureDialog = true;
      this.voiture = voitureInstance;
    }    
    this.actionLabel = 'Modifier';
  }

  deleteVoiture(voiture: any) {
    const voitureInstance = new Voiture(
      voiture._id,
      voiture.puissance_fiscale,
      voiture.marque,
      voiture.modele,
      voiture.nbr_portes,
      voiture.num_chas
    );
    if (voitureInstance && voitureInstance.Id) {
      this.deleteVoitureDialog = true;
      this.voiture = voitureInstance;
    } else {
      console.error('voiture object is missing ID:', voitureInstance);
    }
  }
  
  confirmDelete() {
    if (this.voiture && this.voiture.Id) {
      this.voitureService.deleteVoiture(this.voiture.Id).subscribe(
        response => {
          this.voitures = this.voitures.filter(val => val.Id !== this.voiture.Id);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Voiture supprimé', life: 3000 });
          this.voiture = new Voiture('', 0, '', '', 0, '');

          this.deleteVoitureDialog = false;
        },
        error => {
          console.error('Erreur lors de la suppression du voiture:', error);
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de la suppression du voiture', life: 3000 });
          this.deleteVoitureDialog = false;
        }
      );
    } else {
      console.error('ID de voiture invalide:', this.voiture);
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'ID de voiture invalide', life: 3000 });
      this.deleteVoitureDialog = false;
    }
  }

  hideDialog() {
    this.voitureDialog = false;
    this.submitted = false;
  }

  saveVoiture(): void {
    // Créer un objet voiture à envoyer en JSON
    const voitureData = {
      puissance_fiscale: this.voiture.PuissanceFiscale,
      marque: this.voiture.Marque,
      modele: this.voiture.Modele,
      nbr_portes: this.voiture.NbrPortes,
      num_chas: this.voiture.NumChas
    };
  
    // Vérifiez les données dans la console pour vous assurer qu'elles sont bien formatées
    console.log(voitureData);
  
    if (this.voiture.Id) {
      // Mise à jour du voiture existant
      this.voitureService.putVoiture(this.voiture.Id, voitureData).subscribe(
        res => {
          this.voitureDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Voiture mis à jour', life: 3000 });
          this.getAllVoitures();
        },
        (error: HttpErrorResponse) => {
          console.error('Erreur lors de la mise à jour du voiture:', error);
          this.messageService.add({ severity: 'error', summary: 'Erreur lors de la mise à jour du voiture', detail: error.message });
        }
      );
    } else {
      // Ajouter un nouveau voiture
      this.voitureService.addVoiture(voitureData).subscribe(
        res => {
          this.voitureDialog = false;
          this.voiture = new Voiture('', 0, '', '', 0, '');
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Voiture ajouté', life: 3000 });
          this.getAllVoitures();
        },
        (error: HttpErrorResponse) => {
          console.error('Erreur lors de l\'ajout du voiture:', error);
          this.messageService.add({ severity: 'error', summary: 'Erreur lors de l\'ajout du voiture', detail: error.message });
        }
      );
    }
  }
  

  getAllVoitures(): void {
    this.voitureService.getVoiture().subscribe(
      voitures => {
        this.voitures = voitures;
      },
      error => {
        console.error('Erreur lors de la récupération des voitures:', error);
      }
    );
  }
  

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }



}
