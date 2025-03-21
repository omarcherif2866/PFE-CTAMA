import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { Actualite } from 'src/app/components/models/actualite';
import { ActualiteService } from 'src/app/components/services/actualite.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-actualite',
  templateUrl: './actualite.component.html',
  styleUrl: './actualite.component.scss'
})
export class ActualiteComponent {
  displayModal: boolean = false;
  selectedDescription: string = '';
  actualiteDialog: boolean = false;
  actionLabel: string = 'Enregistrer';
  deleteActualiteDialog: boolean = false;
  actualites: Actualite[] = [];
  actualite!: Actualite 
  selectedActualites: Actualite[] = [];
  actualiteImageUrl!: string; 
  actualiteForm!: FormGroup;

  submitted: boolean = false;
  uploadedFiles: File[] = [];

  cols: any[] = [];
  rowsPerPageOptions = [5, 10, 20];


  constructor(
    private actualiteService: ActualiteService,
    private messageService: MessageService,
    private fb: FormBuilder

  ) {}

  ngOnInit() {
      this.actualite = new Actualite('', '', '','');
    this.uploadedFiles = []; 
    this.getAllActualites();
    this.initForm()
  }


    initForm() {
      this.actualiteForm = this.fb.group({
        nom: ['', Validators.required],
        description: ['', Validators.required],  // Ajout du prénom
        image: [null],
      });
    }

  showFullDescription(description: string) {
    this.selectedDescription = description;
    this.displayModal = true;
}

  openNew() {
    this.actualite = new Actualite('', '', '','');

    this.submitted = false;
    this.actualiteDialog = true;
    this.actionLabel = 'Enregistrer';

  }

  editActualite(actualite: any) {
    const actualiteInstance = new Actualite(
      actualite._id,
      actualite.nom,
      actualite.description,
      actualite.image,

    );
    if (actualiteInstance && actualiteInstance.Id) {
      this.actualiteDialog = true;
      this.actualite = actualiteInstance;
    }    
    this.actionLabel = 'Modifier';
  }

  deleteActualite(actualite: any) {
    const actualiteInstance = new Actualite(
      actualite._id,
      actualite.nom,
      actualite.description,
      actualite.image,
    );
    if (actualiteInstance && actualiteInstance.Id) {
      this.deleteActualiteDialog = true;
      this.actualite = actualiteInstance;
    } else {
      console.error('actualite object is missing ID:', actualiteInstance);
    }
  }

  confirmDelete() {
    if (this.actualite && this.actualite.Id) {
      this.actualiteService.deleteActualite(this.actualite.Id).subscribe(
        response => {
          this.actualites = this.actualites.filter(val => val.Id !== this.actualite.Id);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Actualite supprimé', life: 3000 });
          this.actualite = new Actualite('', '', '',  '');

          this.deleteActualiteDialog = false;
        },
        error => {
          console.error('Erreur lors de la suppression du actualite:', error);
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de la suppression du actualite', life: 3000 });
          this.deleteActualiteDialog = false;
        }
      );
    } else {
      console.error('ID de actualite invalide:', this.actualite);
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'ID de actualite invalide', life: 3000 });
      this.deleteActualiteDialog = false;
    }
  }

  hideDialog() {
    this.actualiteDialog = false;
    this.submitted = false;
  }

  saveActualite() {
    this.submitted = true;
  
    // Vérifier si le formulaire est valide
    if (this.actualiteForm.invalid) {
      return;
    }
  
    // Créer un objet FormData pour envoyer les données
    const actualiteData = new FormData();
  
    // Ajouter les propriétés de base
    actualiteData.append('nom', this.actualiteForm.get('nom')!.value);
    actualiteData.append('description', this.actualiteForm.get('description')!.value);
  
    // Ajouter l'image si elle est sélectionnée
    if (this.uploadedFiles && this.uploadedFiles.length > 0) {
      actualiteData.append('image', this.uploadedFiles[0]);
    }
  
    // Appeler le service pour ajouter l'actualite
    this.actualiteService.addActualite(actualiteData).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Actualite ajouté avec succès' });
        this.actualiteDialog = false; // Fermer le dialogue
        this.actualiteForm.reset(); // Réinitialiser le formulaire
        window.location.reload(); // Recharger la page
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de l\'ajout de l\'actualite' });
      }
    );
  }

  getAllActualites(): void {
    this.actualiteService.getActualite().subscribe(
      actualites => {
        this.actualites = actualites;
      },
      error => {
        console.error('Erreur lors de la récupération des actualites:', error);
      }
    );
  }

onGlobalFilter(table: any, event: Event) {
  table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
}

onFileSelected(event: any): void {
  if (event.files && event.files.length > 0) {
    this.uploadedFiles = [];
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
  } else {
    console.error("Erreur lors de la sélection du fichier : la propriété 'files' n'est pas définie dans l'événement.");
  }
}

getImageUrl(imageName: string): string {
  return `${imageName}`;
}


}
