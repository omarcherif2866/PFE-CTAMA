import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpertService } from 'src/app/components/services/expert.service';
import { MenuItem } from 'primeng/api';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-rapport-expertise',
  templateUrl: './rapport-expertise.component.html',
  styleUrl: './rapport-expertise.component.scss'
})
export class RapportExpertiseComponent {
  documentForm!: FormGroup;
  actionLabel: string = 'Enregistrer';
  documentDialog: boolean = false;
  selectedDocuments: any[] = [];
  cols: any[] = [];
  rowsPerPageOptions = [5, 10, 20];
  documents: any[] = [];
  items!: MenuItem[];
  activeIndex: number = 0;
  descriptionLength: number = 0; // Suivi du nombre de caractères
  selectedFiles: File[] = [];
  selectedPdfName: string = ''; // Stocke le nom du PDF
  selectedPdf: SafeResourceUrl | null = null;
  displayPdfDialog: boolean = false;
  selectedExpert: any = null;
  displayExpertDialog: boolean = false;

  constructor(private fb: FormBuilder, private expertService: ExpertService,private sanitizer: DomSanitizer) {}


    ngOnInit(): void {

  
      this.documentForm = this.fb.group({
        assure: ['', Validators.required],
        contratAssure: [''],
        dossier: [''],
        immatriculation: [''],
        tiers: [''],
        contratTiers: [''],
        cieAdv: [''],
        immatriculationTiers: [''],
        dateExamen: [''],
        vehExpertise: [''],
        lieuExamen: [''],
        marque: [''],
        type: [''],
        puissance: [''],
        indexKm: [''],
        genre: [''],
        couleur: [''],
        etatVeh: [''],
        energie: [''],
        numSerie: [''],
        date1MC: [''],
        circonstance: [''],
        vn: [''],
        vv: [''],
        description: ['', [Validators.maxLength(999)]], // Ajouter la validation maxLength ici
        mandant: [''],
        agence: [''],
        dateAccident: [''],
        fournitures: this.fb.array([]),
        mainOeuvres: this.fb.array([]),
        OuvDossier: [''],
        enquête: [''],
        Déplacements: [''],
        Frais2èmeExp: [''],
        Photos: [''],
        FraisPTTAutres: [''],
        Honoraires: [''],
        images: this.fb.control([]),
        expertId: ['']
      });
      
      const expertId = this.getUserId();
      if (expertId) {
        this.documentForm.patchValue({ expertId }); // injecter dans le form
      }

      this.items = [
        { label: 'Assuré' },
        { label: 'Tiers' },
        { label: 'Véhicule' },
        { label: 'Infos' },
        { label: 'Fournitures' },
        { label: 'Main D\'oeuve' },
        { label: 'Décompte' },
        { label: 'Images' },

      ];
      

      this.loadRapports();


    }

    openNew() {
      this.documentForm.reset(); // Réinitialiser le formulaire
      this.documentDialog = true; // Affiche la boîte de dialogue
      this.actionLabel = 'Enregistrer';
    }
    
    getUserId(): string | null {
      return localStorage.getItem('user_id');
    }

    getUserRole(): string | null {
      return localStorage.getItem('userRole');
    }

    onSubmit() {
      if (this.documentForm.valid) {
        // Appelez la fonction uploadImages pour envoyer les fichiers avant l'envoi du reste du formulaire
        this.uploadImages().then(() => {

          const expertId = this.getUserId();
          if (expertId) {
            this.documentForm.patchValue({ expertId });
          }

          // Une fois l'upload terminé, vous pouvez envoyer les autres données du formulaire
          this.expertService.envoyerRapport(this.documentForm.value).subscribe({
            next: (response: Blob) => {
              // Création de l'URL pour le Blob PDF
              const link = document.createElement('a');
              const url = window.URL.createObjectURL(response);
              link.href = url;
              const assureNom = this.documentForm.get('assure')?.value?.toString().replace(/\s+/g, '_') || 'inconnu';
              link.download = `rapport_expertise_${assureNom}.pdf`;              
              link.click(); // Déclenchement du téléchargement
              window.URL.revokeObjectURL(url); // Libération de l'URL
            },
            error: err => {
              console.error('Erreur lors de l’envoi', err);
            }
          });
        }).catch((error) => {
          console.error('Erreur lors de l’upload des images', error);
        });
      }
    }




    onGlobalFilter(table: any, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }


    onActiveIndexChange(index: number) {
      this.activeIndex = index;
    }
    
    nextStep() {
      if (this.activeIndex < this.items.length - 1) {
        this.activeIndex++;
      }
    }

    get fournitures(): FormArray {
      return this.documentForm.get('fournitures') as FormArray;
    }
    
    addFourniture(): void {
      this.fournitures.push(this.fb.group({
        nom: ['', Validators.required],
        prix: [0, [Validators.required, Validators.min(0)]],
        remise: [0, [Validators.min(0), Validators.max(100)]]
      }));
    }
    
    removeFourniture(index: number): void {
      this.fournitures.removeAt(index);
    }

    get mainOeuvres(): FormArray {
      return this.documentForm.get('mainOeuvres') as FormArray;
    }
    
    addMainOeuvres(): void {
      this.mainOeuvres.push(this.fb.group({
        nom: ['', Validators.required],
        prix: [0, [Validators.required, Validators.min(0)]],
      }));
    }
    
    removeMainOeuvres(index: number): void {
      this.mainOeuvres.removeAt(index);
    }

    onDescriptionChange(event: any) {
      this.descriptionLength = event.target.value.length; // Met à jour le compteur de caractères
    }

    onFileSelected(event: any): void {
      const files: File[] = Array.from(event.target.files);
      const existingFiles: File[] = this.documentForm.get('images')?.value || [];
      
      // Ajouter les fichiers sélectionnés à ceux déjà présents
      const updatedFiles = [...existingFiles, ...files];
    
      // Mettez à jour la valeur du FormControl 'images'
      this.documentForm.patchValue({ images: updatedFiles });
    
      console.log("Fichiers sélectionnés:", updatedFiles);
    }
    

removeFile(fileToRemove: File): void {
  const currentFiles: File[] = this.documentForm.get('images')?.value || [];
  const updatedFiles = currentFiles.filter(file => file !== fileToRemove);

  // Mettez à jour la valeur du FormControl 'images' après suppression
  this.documentForm.patchValue({ images: updatedFiles });
}


uploadImages(): Promise<any> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    const files: File[] = this.documentForm.get('images')?.value;

    if (files && files.length > 0) {
      files.forEach(file => {
        formData.append('images', file);
      });

      // Envoi de la requête au backend pour l'upload des images
      this.expertService.uploadImages(formData).subscribe(response => {
        console.log('Réponse upload images:', response);
      
        if (response.files && Array.isArray(response.files)) {
          this.documentForm.get('images')?.setValue(response.files);
        }
      
        resolve(response);
      }, (error: any) => {
        console.error('Erreur upload images:', error);
        reject(error);
      });

}  })}


loadRapports(): void {
  const userRole = this.getUserRole();
  const userId = this.getUserId();

  if (userRole === 'expert' && userId) {
    this.expertService.getRapportsByExpert(userId).subscribe(data => {
      this.documents = data;
    });
  } else if (userRole === 'admin' || userRole === 'gestionnaire_sinistre') {
    this.expertService.getAllRapports().subscribe(data => {
      this.documents = data;
    });
  }
}

openPdf(pdfPath: string): void {
  if (!pdfPath) {
    console.error("Aucun chemin de PDF fourni !");
    return;
  }

  const fullPath = `http://localhost:9090/pdf/${pdfPath}`;
  
  this.selectedPdf = this.sanitizer.bypassSecurityTrustResourceUrl(fullPath);
  this.selectedPdfName = pdfPath; 
  this.displayPdfDialog = true;
}

showExpertInfo(expertId: string): void {
  console.log("ID de l'expert reçu :", expertId); // Vérification
  if (!expertId) {
      console.error("Aucun ID Expert fourni.");
      return;
  }

  this.expertService.getExpertById(expertId).subscribe(
      (expert: any) => {
          console.log("Données de l'expert reçues :", expert); // Vérification
          this.selectedExpert = expert; 
          this.displayExpertDialog = true; 
      },
      (error) => {
          console.error("Erreur lors du chargement de l'expert :", error);
          this.selectedExpert = { error: "Erreur lors du chargement du client" };
          this.displayExpertDialog = true;
      }
  );
}

}
