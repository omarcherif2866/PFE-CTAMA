import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Agence, Gouvernorat } from 'src/app/components/models/agence';
import { AgenceService } from 'src/app/components/services/agence.service';

@Component({
  selector: 'app-agence',
  templateUrl: './agence.component.html',
  styleUrl: './agence.component.scss'
})
export class AgenceComponent {
 displayModal: boolean = false; // Contrôle la visibilité du modal

  agenceDialog: boolean = false;
  actionLabel: string = 'Enregistrer';
  deleteAgenceDialog: boolean = false;
  agences: Agence[] = [];
  agence!: Agence

  selectedAgences: Agence[] = [];

  submitted: boolean = false;

  cols: any[] = [];
  rowsPerPageOptions = [5, 10, 20];
  gouvernoratOptions: { label: string, value: Gouvernorat }[] = [];

  constructor(
    private agenceService: AgenceService,
    private messageService: MessageService,
  ) {}
  
    ngOnInit() {
      this.agence = new Agence('', '', '', '', '', '','');
      this.getAllAgences();
      this.getGouvernaurat();
    }

  openNew() {
    this.agence = new Agence('', '', '', '', '', '','');

    this.submitted = false;
    this.agenceDialog = true;
    this.actionLabel = 'Enregistrer';

  }

  editAgence(agence: any) {
    const agenceInstance = new Agence(
      agence._id,
      agence.nom,
      agence.chefAgence,
      agence.email,
      agence.numero,
      agence.adresse,
      agence.gouvernorat,

    );
    if (agenceInstance && agenceInstance.Id) {
      this.agenceDialog = true;
      this.agence = agenceInstance;
    }    
    this.actionLabel = 'Modifier';
  }

  deleteAgence(agence: any) {
    const agenceInstance = new Agence(
      agence._id,
      agence.nom,
      agence.chefAgence,
      agence.email,
      agence.numero,
      agence.adresse,
      agence.gouvernorat
    );
    if (agenceInstance && agenceInstance.Id) {
      this.deleteAgenceDialog = true;
      this.agence = agenceInstance;
    } else {
      console.error('agence object is missing ID:', agenceInstance);
    }
  }
  
  confirmDelete() {
    if (this.agence && this.agence.Id) {
      this.agenceService.deleteAgence(this.agence.Id).subscribe(
        response => {
          this.agences = this.agences.filter(val => val.Id !== this.agence.Id);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Agence supprimé', life: 3000 });
  
          this.deleteAgenceDialog = false;
  
          setTimeout(() => {
            window.location.reload();
          }, 1000); // Rafraîchit la page après 1 seconde pour laisser voir le message
        },
        error => {
          console.error('Erreur lors de la suppression de l\'agence:', error);
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de la suppression de l\'agence', life: 3000 });
          this.deleteAgenceDialog = false;
        }
      );
    } else {
      console.error('ID de l\'agence invalide:', this.agence);
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'ID de l\'agence invalide', life: 3000 });
      this.deleteAgenceDialog = false;
    }
  }
  

  hideDialog() {
    this.agenceDialog = false;
    this.submitted = false;
  }

  saveAgence(): void {
    // Créer un objet agence à envoyer en JSON
    const agenceData = {
      nom: this.agence.Nom,
      chefAgence: this.agence.ChefAgence,
      email: this.agence.Email,
      numero: this.agence.Numero,
      adresse: this.agence.Adresse,
      gouvernorat: this.agence.Gouvernorat

    };
  
    // Vérifiez les données dans la console pour vous assurer qu'elles sont bien formatées
    console.log(agenceData);
  
    if (this.agence.Id) {
      // Mise à jour du agence existant
      this.agenceService.putAgence(this.agence.Id, agenceData).subscribe(
        res => {
          this.agenceDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Agence mis à jour', life: 3000 });
          this.getAllAgences();
        },
        (error: HttpErrorResponse) => {
          console.error('Erreur lors de la mise à jour du agence:', error);
          this.messageService.add({ severity: 'error', summary: 'Erreur lors de la mise à jour du agence', detail: error.message });
        }
      );
    } else {
      // Ajouter un nouveau agence
      this.agenceService.addAgence(agenceData).subscribe(
        res => {
          this.agenceDialog = false;
          this.agence = new Agence('', '', '', '', '', '','');
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Agence ajouté', life: 3000 });
          this.getAllAgences();
        },
        (error: HttpErrorResponse) => {
          console.error('Erreur lors de l\'ajout du agence:', error);
          this.messageService.add({ severity: 'error', summary: 'Erreur lors de l\'ajout du agence', detail: error.message });
        }
      );
    }
  }
  

  getAllAgences(): void {
    this.agenceService.getAgence().subscribe(
      agences => {
        this.agences = agences;
      },
      error => {
        console.error('Erreur lors de la récupération des agences:', error);
      }
    );
  }
  

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }


  getGouvernaurat(){
    this.gouvernoratOptions = Object.values(Gouvernorat).map(gouv => ({
      label: gouv,  // Ce qui est affiché dans le menu déroulant
      value: gouv   // La valeur stockée dans `agence.Gouvernorat`
    }));
  
  }

}