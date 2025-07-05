import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpertService } from 'src/app/components/services/expert.service';
import { MenuItem } from 'primeng/api';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FournituresService } from 'src/app/components/services/fournitures.service';
import { Fournitures } from 'src/app/components/models/fournitures';

@Component({
  selector: 'app-rapport-expertise',
  templateUrl: './rapport-expertise.component.html',
  styleUrl: './rapport-expertise.component.scss'
})
export class RapportExpertiseComponent {
  documentForm!: FormGroup;
  formGroup!: FormGroup;
  mainOeuvreGroup!: FormGroup;
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

  filteredFournitures: Fournitures[] = [];
  selectedFourniture: Fournitures | null = null;
  allFournitures: Fournitures[] = [];
  showAddNewButton: boolean = false;
  showFournitureForm: boolean = false;
  
  filteredMainOeuvre: Fournitures[] = [];
  selectedMainOeuvre: Fournitures | null = null;
  allMainOeuvre: Fournitures[] = [];
  showMainOeuvreForm: boolean = false;
  showAddNewButtonMO: boolean = false;

  constructor(private fb: FormBuilder, private expertService: ExpertService,
    private sanitizer: DomSanitizer ,private fournitureService: FournituresService, private cd: ChangeDetectorRef ) {}


    ngOnInit(): void {

    this.formGroup = this.fb.group({
      fournitures: this.fb.array([]),
      selectedFourniture: [null],  // Ajout du contrôle pour l'autocomplete
    });

    this.mainOeuvreGroup = this.fb.group({
      mainOeuvres: this.fb.array([]),
      selectedMainOeuvre: [null]  // Ajout du contrôle pour l'autocomplete
    });
  
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
        references: [''],
        nomExpert: [''],
        emailExpert: [''],
        nomSocieteExpert: [''],
        adresseSocieteExpert: [''],
        patente: [''],
        images: this.fb.control([]),
        expertId: [''],
      });
      
      const expertId = this.getUserId();
      if (expertId) {
        this.documentForm.patchValue({ expertId }); // injecter dans le form
      }

      this.items = [
        { label: 'Assuré' },
        { label: 'Tiers' },
        { label: 'Véhicule' },
        { label: 'Infos de l\'éxpert' },
        { label: 'Infos' },
        { label: 'Fournitures' },
        { label: 'Main D\'oeuve' },
        { label: 'Décompte' },
        { label: 'Images' },

      ];
      

      this.loadRapports();
      this.loadFournitures();

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
          this.syncFournituresToDocumentForm();
          this.syncMainOeuvresToDocumentForm();
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

          const fournitures = this.documentForm.value.fournitures;

            if (Array.isArray(fournitures)) {
              fournitures.forEach((fournitureItem: any, index: number) => {
                let fournitureId = null;

                // Cas 1 : l'objet contient un champ "fourniture" (objet ou string)
                if (fournitureItem.fourniture) {
                  fournitureId = typeof fournitureItem.fourniture === 'string'
                    ? fournitureItem.fourniture
                    : fournitureItem.fourniture._id;
                }

                // Cas 2 : c'est directement la fourniture (id ou objet)
                else if (fournitureItem.id) {
                  fournitureId = fournitureItem.id;
                }

                if (!fournitureId) {
                  console.warn(`Fourniture invalide ou manquante à l'index ${index}:`, fournitureItem);
                  return;
                }

                const data = {
                  fourniture: fournitureId,
                  prix: fournitureItem.prix
                };

                this.fournitureService.addFournituresEval(data).subscribe({
                  next: res => console.log('FournitureEval ajoutée:', res),
                  error: err => console.error('Erreur ajout FournitureEval:', err)
                });
              });
            }




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
  return (this.formGroup?.get('fournitures') || this.documentForm?.get('fournitures')) as FormArray;
}


    
    removeFourniture(index: number): void {
      this.fournitures.removeAt(index);
    }

    get mainOeuvres(): FormArray {
      return (this.mainOeuvreGroup?.get('mainOeuvres') || this.documentForm.get('mainOeuvres')) as FormArray;
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


  loadFournitures(): void {
this.fournitureService.getFournitures().subscribe((data: any[]) => {
  this.allFournitures = data.map(f => new Fournitures(f._id, f.nom, f.type));
  console.log('Fournitures chargées:', this.allFournitures);
});

  }

searchFournitures(event: any): void {
    const query = event.query.toLowerCase().trim();
    console.log('Recherche avec query:', query);
    console.log('Nombre de fournitures disponibles:', this.allFournitures?.length || 0);
    
    // Vérifier si allFournitures est défini
    if (!this.allFournitures || this.allFournitures.length === 0) {
      console.warn('La liste des fournitures est vide ou non définie');
      this.filteredFournitures = [];
      this.showAddNewButton = query.length > 0; // Afficher le bouton si on a tapé quelque chose
      this.cd.detectChanges();
      return;
    }
    
    // Vérifier le format des données pour la première fourniture
    if (this.allFournitures.length > 0) {
      const firstItem = this.allFournitures[0];
      console.log('Format de la première fourniture:', firstItem);
    }
    
    // Filtrer avec vérification de nullité et casse
    this.filteredFournitures = this.allFournitures.filter(f => {
      // Vérification des propriétés pour éviter les erreurs
      const type = (f.Type || f.Type || '').toLowerCase();
      const nom = (f.Nom || f.Nom || '').toLowerCase();
      
      // Corriger le filtrage du type (éviter la duplication)
      const typeMatch = type === 'pieces' || type === 'pièces';
      const nomMatch = nom.includes(query);
      
      console.log(`Fourniture: ${nom}, Type: ${type}, TypeMatch: ${typeMatch}, NomMatch: ${nomMatch}`);
      
      return typeMatch && nomMatch;
    });
    
    console.log('Fournitures filtrées:', this.filteredFournitures);
    
    // Si la requête a du contenu et qu'aucune fourniture exacte n'est trouvée
    const hasExactMatch = this.filteredFournitures.some(f => {
      const nom = (f.Nom || f.Nom || '').toLowerCase();
      return nom === query;
    });
    
    // Afficher le bouton si on a une requête et pas de match exact
    this.showAddNewButton = query.length > 0 && !hasExactMatch;
    
    console.log('Query length:', query.length);
    console.log('Has exact match:', hasExactMatch);
    console.log('Show add button:', this.showAddNewButton);
    
    // Mettre à jour la valeur du formControl pour refléter la recherche
    if (query.length > 0 && this.showAddNewButton) {
      this.formGroup.get('selectedFourniture')?.setValue(query);
    }
    
    this.cd.detectChanges();
}

  onFournitureSelect(event: any): void {
    const fourniture = event.value; // Récupérer la fourniture de l'événement
    this.showAddNewButton = false;
    this.showFournitureForm = true;
    
    // Ajouter la fourniture sélectionnée au FormArray
    this.fournitures.push(this.fb.group({
      id: [fourniture.Id],
      nom: [fourniture.Nom, Validators.required],
      prix: ['', [Validators.required, Validators.min(0)]],
      remise: ['', [Validators.min(0), Validators.max(100)]],
      VET: ['', [Validators.min(0), Validators.max(100)]],
      tva: [false]

    }));
    
    // Effacer la sélection après avoir ajouté
    this.formGroup.get('selectedFourniture')?.setValue(null);
  }

  onFournitureClear(): void {
    this.showAddNewButton = false;
    this.formGroup.get('selectedFourniture')?.setValue(null);
  }


addNewFourniture(): void {
  const selectedValue = this.formGroup.get('selectedFourniture')?.value;
  
  console.log('selectedValue:', selectedValue); // Afficher la valeur sélectionnée
  
  if (selectedValue) {
    // Si selectedValue est une chaîne ou un objet avec une propriété nom
    const nomFourniture = typeof selectedValue === 'string' 
      ? selectedValue 
      : selectedValue.nom || '';
    
    console.log('nomFourniture:', nomFourniture); // Afficher le nom de la fourniture
    
    if (nomFourniture) {
      // Afficher immédiatement le formulaire
      this.showFournitureForm = true;
      
      // AJOUTER IMMÉDIATEMENT AU FORMULAIRE AVANT L'APPEL API
      const tempFormGroup = this.fb.group({
        id: [null], // Sera mis à jour avec l'ID de l'API
        nom: [nomFourniture, Validators.required], // Utiliser le nom saisi
        prix: ['', [Validators.required, Validators.min(0)]],
        remise: ['', [Validators.min(0), Validators.max(100)]],
        VET: ['', [Validators.min(0), Validators.max(100)]],
        tva: [false]
      });
      
      console.log('tempFormGroup avant ajout:', tempFormGroup.value); // Afficher les valeurs du FormGroup avant l'ajout
      
      // Ajouter au formulaire avant l'appel API
      this.fournitures.push(tempFormGroup);
      
      console.log('fournitures après ajout:', this.fournitures.value); // Afficher le tableau des fournitures après ajout
      
      // Garder l'index pour une mise à jour ultérieure
      const newIndex = this.fournitures.length - 1;
      
      // Créer une nouvelle fourniture dans la base de données
      const newFourniture = {
        nom: nomFourniture,
        type: 'Pieces'
      };

      console.log('newFourniture avant appel API:', newFourniture); // Afficher la fourniture avant l'appel API

this.fournitureService.addFournitures(newFourniture).subscribe(
  (result: any) => {  // On met any pour gérer le mapping
    console.log('Résultat brut API:', result);

    // Mapper le résultat pour correspondre à ton modèle
    const mappedResult: any = {
      _id: result.id,       // map id → Id
      nom: result.nom,
      type: result.type
    };

    // Ajouter la nouvelle fourniture à la liste locale
    this.allFournitures.push(mappedResult);

    // Mettre à jour l'ID dans le FormGroup
    (this.fournitures.at(newIndex) as FormGroup).get('id')?.setValue(mappedResult._id);

    this.showAddNewButton = false;
    this.formGroup.get('selectedFourniture')?.setValue(null);

    console.log('fournitures après mise à jour de l\'ID:', this.fournitures.value);
  },
  (error) => {
    console.error('Erreur lors de l\'ajout de la fourniture:', error);
    this.fournitures.removeAt(newIndex);
    this.showFournitureForm = this.fournitures.length > 0;
  }
);

    }
  }
}

// Méthode pour synchroniser les fournitures entre formGroup et documentForm
syncFournituresToDocumentForm(): void {
  const documentFournitures = this.documentForm.get('fournitures') as FormArray;

  // Vider le tableau existant
  while (documentFournitures.length) {
    documentFournitures.removeAt(0);
  }

  // Ajouter les FormGroup actuels de fournitures avec leurs valeurs mises à jour
  this.fournitures.controls.forEach((fg: AbstractControl) => {
    const fournitureForm = fg as FormGroup;

    documentFournitures.push(this.fb.group({
      id: [fournitureForm.get('id')?.value],
      nom: [fournitureForm.get('nom')?.value],
      prix: [fournitureForm.get('prix')?.value],
      remise: [fournitureForm.get('remise')?.value],
      VET: [fournitureForm.get('VET')?.value],
      tva: [fournitureForm.get('tva')?.value]

    }));
  });

  console.log('fournitures après synchronisation avec documentForm:', documentFournitures.value);
}



addNewMainOeuvre(): void {
  const selectedValue = this.mainOeuvreGroup.get('selectedMainOeuvre')?.value;

  console.log('selectedValue:', selectedValue);

  if (selectedValue) {
    const nomMainOeuvre = typeof selectedValue === 'string' 
      ? selectedValue 
      : selectedValue.nom || '';

    console.log('nomMainOeuvre:', nomMainOeuvre);

    if (nomMainOeuvre) {
      this.showMainOeuvreForm = true;

      const tempFormGroup = this.fb.group({
        id: [null],
        nom: [nomMainOeuvre, Validators.required],
        prix: ['', [Validators.required, Validators.min(0)]],
        R: ['', [Validators.required, Validators.min(0)]],
        tva: [false]

      });

      console.log('tempFormGroup avant ajout:', tempFormGroup.value);

      this.mainOeuvres.push(tempFormGroup);

      const newIndex = this.mainOeuvres.length - 1;

      const newMainOeuvre = {
        nom: nomMainOeuvre,
        type: 'MainsDoeuvre'  // ✅ Spécifier le type main d’œuvre ici
      };

      console.log('newMainOeuvre avant appel API:', newMainOeuvre);

      this.fournitureService.addFournitures(newMainOeuvre).subscribe(
        (result: Fournitures) => {
          console.log('Résultat de l\'API:', result);

          this.allMainOeuvre.push(result);

          (this.mainOeuvres.at(newIndex) as FormGroup).get('id')?.setValue(result.Id);

          this.showAddNewButtonMO = false;
          this.mainOeuvreGroup.get('selectedMainOeuvre')?.setValue(null);

          console.log('mainOeuvres après mise à jour de l\'ID:', this.mainOeuvres.value);
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de la fourniture:', error);
          this.mainOeuvres.removeAt(newIndex);
          this.showFournitureForm = this.mainOeuvres.length > 0;
        }
      );
    }
  }
}


searchMainOeuvres(event: any): void {
    const query = event.query.toLowerCase();
    console.log('Recherche avec query:', query);
    console.log('Nombre de fournitures disponibles:', this.allFournitures?.length || 0);
    
    // Vérifier si allFournitures est défini
    if (!this.allFournitures || this.allFournitures.length === 0) {
      console.warn('La liste des fournitures est vide ou non définie');
      this.filteredMainOeuvre = [];
      return;
    }
    
    // Vérifier le format des données pour la première fourniture
    if (this.allFournitures.length > 0) {
      const firstItem = this.allFournitures[0];
      console.log('Format de la première fourniture:', firstItem);
    }
    
    // Filtrer avec vérification de nullité et casse
    this.filteredMainOeuvre = this.allFournitures.filter(f => {
      // Vérification des propriétés pour éviter les erreurs
      const type = f.Type  || '';
      const nom = f.Nom  || '';
      
      const typeMatch = type.toLowerCase() === 'mainsdoeuvre' || type.toLowerCase() === 'mainsdoeuvre';
      const nomMatch = nom.toLowerCase().includes(query);
      
      return typeMatch && nomMatch;
    });
    
    console.log('Fournitures filtrées:', this.filteredMainOeuvre);
    
    // Si la requête a du contenu et qu'aucune fourniture exacte n'est trouvée
    const hasExactMatch = this.filteredMainOeuvre.some(f => 
      (f.Nom || '').toLowerCase() === query.toLowerCase()
    );
    
    this.showAddNewButtonMO = query.length > 0 && !hasExactMatch;
    
    // Mettre à jour la valeur du formControl pour refléter la recherche
    if (query.length > 0 && this.showAddNewButtonMO) {
      this.mainOeuvreGroup.get('selectedMainOeuvre')?.setValue(query);
    }
    this.cd.detectChanges();
  }

  onMainOeuvresSelect(event: any): void {
    const mainOeuvre = event.value; // Récupérer la fourniture de l'événement
    this.showAddNewButtonMO = false;
    this.showMainOeuvreForm = true;
    
    // Ajouter la fourniture sélectionnée au FormArray
    this.mainOeuvres.push(this.fb.group({
      id: [mainOeuvre.Id],
      nom: [mainOeuvre.Nom, Validators.required],
      prix: ['', [Validators.required, Validators.min(0)]],
      R: ['', [Validators.required, Validators.min(0)]],
      tva: [false]
    }));
    
    // Effacer la sélection après avoir ajouté
    this.mainOeuvreGroup.get('selectedMainOeuvre')?.setValue(null);
  }

  onMainOeuvresClear(): void {
    this.showAddNewButtonMO = false;
    this.mainOeuvreGroup.get('selectedMainOeuvre')?.setValue(null);
  }

syncMainOeuvresToDocumentForm(): void {
  const documentMainOeuvres = this.documentForm.get('mainOeuvres') as FormArray;

  // Vider le tableau existant
  while (documentMainOeuvres.length) {
    documentMainOeuvres.removeAt(0);
  }

  // Ajouter les FormGroup actuels de mainOeuvres avec leurs valeurs mises à jour
  this.mainOeuvres.controls.forEach((fg: AbstractControl) => {
    const mainOeuvreForm = fg as FormGroup;

    documentMainOeuvres.push(this.fb.group({
      id: [mainOeuvreForm.get('id')?.value],
      nom: [mainOeuvreForm.get('nom')?.value],
      prix: [mainOeuvreForm.get('prix')?.value],
      R: [mainOeuvreForm.get('R')?.value],
      tva: [mainOeuvreForm.get('tva')?.value],

    }));
  });

  console.log('mainOeuvres après synchronisation avec documentForm:', documentMainOeuvres.value);
}


}
