import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Expert, Gouvernorat } from 'src/app/components/models/expert';
import { ExpertService } from 'src/app/components/services/expert.service';
@Component({
  selector: 'app-expert',
  templateUrl: './expert.component.html',
  styleUrl: './expert.component.scss'
})
export class ExpertComponent {
  expertForm!: FormGroup;
  expertDialog: boolean = false;
  deleteexpertDialog: boolean = false;
  experts: Expert[] = [];
  expert!: Expert ;
  uploadedFiles: File[] = [];
  actionLabel: string = 'Enregistrer';
  submitted: boolean = false;
  cols!: any[];
  selectedExpert: Expert[] = [];
  gouvernoratOptions: { label: string, value: Gouvernorat }[] = [];

  constructor(
    private fb: FormBuilder,
    private expertService: ExpertService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.initForm();
    this.getAllExperts();
    this.getGouvernaurat();

  }
  
    getGouvernaurat(){
      this.gouvernoratOptions = Object.values(Gouvernorat).map(gouv => ({
        label: gouv,  // Ce qui est affiché dans le menu déroulant
        value: gouv   // La valeur stockée dans `agence.Gouvernorat`
      }));
    
    }

  initForm() {
    this.expertForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],  // Ajout du prénom
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8), 
        Validators.pattern('^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$')  
      ]],
      phoneNumber: ['', Validators.required],
      region: ['', Validators.required],  // Ajout de la région
      taux: ['', [Validators.required, Validators.min(0)]],  // Ajout du taux avec validation
      image: [null],
    });
  }
  
  
  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  openNew() {
    this.expert = new Expert('', '', '', '', '', '', 0, '', '', []);
    this.submitted = false;
    this.expertForm.reset();
    this.expertDialog = true;
  }

editExpert(expert: any) {
  const expertInstance = new Expert(
    expert._id,
    expert.email,
    '', // password vide
    expert.image,
    expert.phoneNumber,
    expert.region,
    expert.taux,
    expert.nom,
    expert.prenom,
    [],
    []
  );

  if (expertInstance && expertInstance.Id) {
    this.expertDialog = true;
    this.expert = expertInstance;

    // ✅ Mise à jour du formulaire avec les données de l'expert
    this.expertForm.patchValue({
      nom: expert.nom,
      prenom: expert.prenom,
      email: expert.email,
      phoneNumber: expert.phoneNumber,
      region: expert.region,
      taux: expert.taux,
      password: '', // Optionnel : laisser vide
    });

    this.uploadedFiles = []; // Optionnel : réinitialiser le fichier
    this.actionLabel = 'Modifier';
  }
}

  

  deleteExpert(expert: any) {
    const expertInstance = new Expert(
      expert._id,
      expert.email,
      expert.image,
      expert.phoneNumber,
      expert.region,
      expert.taux,
      expert.nom,
      expert.prenom,
      '',
      []
    );
    if (expertInstance && expertInstance.Id) {
      this.deleteexpertDialog = true;
      this.expert = expertInstance;
    } else {
      console.error('expert object is missing ID:', expertInstance);
    }
  }

  confirmDelete() {
    if (this.expert && this.expert.Id) {
      this.expertService.deleteExpert(this.expert.Id).subscribe(
        response => {
          this.experts = this.experts.filter(val => val.Id !== this.expert.Id);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Expert supprimé', life: 3000 });
          this.expert = new Expert('', '', '', '', '', '', 0, '', '', []);
          this.deleteexpertDialog = false;
          window.location.reload();
        },
        error => {
          console.error('Erreur lors de la suppression du expert:', error);
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de la suppression du expert', life: 3000 });
          this.deleteexpertDialog = false;
        }
      );
    } else {
      console.error('ID de expert invalide:', this.expert);
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'ID de expert invalide', life: 3000 });
      this.deleteexpertDialog = false;
    }
  }

  hideDialog() {
    this.expertDialog = false;
    this.submitted = false;
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

  saveExpert() {
    this.submitted = true;
  
    // Vérifier si le formulaire est valide
    if (this.expertForm.invalid) {
      return;
    }
  
    // Créer un objet FormData pour envoyer les données
    const expertData = new FormData();
  
    // Ajouter les propriétés de base
    expertData.append('nom', this.expertForm.get('nom')!.value);
    expertData.append('prenom', this.expertForm.get('prenom')!.value);
    expertData.append('email', this.expertForm.get('email')!.value);
    expertData.append('password', this.expertForm.get('password')!.value);
    expertData.append('phoneNumber', this.expertForm.get('phoneNumber')!.value);
    expertData.append('region', this.expertForm.get('region')!.value);
    expertData.append('taux', this.expertForm.get('taux')!.value);
  
    // Ajouter l'image si elle est sélectionnée
    if (this.uploadedFiles && this.uploadedFiles.length > 0) {
      expertData.append('image', this.uploadedFiles[0]);
    }
  
    // Appeler le service pour ajouter l'expert
    this.expertService.addExpert(expertData).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Expert ajouté avec succès' });
        this.expertDialog = false; // Fermer le dialogue
        this.expertForm.reset(); // Réinitialiser le formulaire
        window.location.reload(); // Recharger la page
      },
      (error) => {
        const errorMsg = error?.error?.message || 'Échec de l\'ajout de l\'expert';
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: errorMsg });
      }

    );
  }
  
  getAllExperts(): void {
    this.expertService.getExpert().subscribe(
      experts => {
        this.experts = experts;
      },
      error => {
        console.error('Erreur lors de la récupération des experts:', error);
      }
    );
  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }



}
