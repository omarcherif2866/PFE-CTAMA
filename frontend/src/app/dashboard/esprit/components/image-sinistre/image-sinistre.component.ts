import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { Clients } from 'src/app/components/models/clients';
import { Documents } from 'src/app/components/models/documents';
import { Expert } from 'src/app/components/models/expert';
import { ImageSinistre } from 'src/app/components/models/image-sinistre';
import { AuthService } from 'src/app/components/services/auth/auth.service';
import { DocumentService } from 'src/app/components/services/document.service';
import { ExpertService } from 'src/app/components/services/expert.service';
import { ImagesinistreService } from 'src/app/components/services/imagesinistre.service';

@Component({
  selector: 'app-image-sinistre',
  templateUrl: './image-sinistre.component.html',
  styleUrls: ['./image-sinistre.component.scss']
})
export class ImageSinistreComponent implements OnInit {
  displayModal: boolean = false; // Contrôle la visibilité du modal

  imageSinistreDialog: boolean = false;
  actionLabel: string = 'Enregistrer';
  deleteImageDialog: boolean = false;
  imageSinistres: ImageSinistre[] = [];
  imageSinistre!: ImageSinistre
  submitted: boolean = false;
  selectedImages: ImageSinistre[] = [];
  displayDialog: boolean = false;
  selectedImage: string | null = null;
  imagesList: string[] = [];
  currentIndex: number = 0;

  selectedFiles: File[] = [];
  expertId: string | null = null;
  clients: any[] = [];

  selectedClientId: string | null = null;
  documentsCommun: Documents[] = []; // ✅ Correction du type
  selectedDocument: Documents | null = null;

  cols: any[] = [];
  rowsPerPageOptions = [5, 10, 20];

  expertInfos: { [key: string]: string } = {};  // Stocke les infos par document ID
  selectedExpert: any = null;
  displayExpertDialog: boolean = false;

  selectedPdf: SafeResourceUrl | null = null;
  selectedPdfName: string = ''; // Stocke le nom du PDF
  displayPdfDialog: boolean = false;
  
  displayClientDialog: boolean = false;
  selectedClient: any = null;
  constructor(private expertService: ExpertService,
              private authservice : AuthService,
              private documentService : DocumentService,
              private messageService: MessageService,
              private imageService: ImagesinistreService,
              private sanitizer: DomSanitizer,



  ) {}

  ngOnInit(): void {
    const userRole = this.getUserRole(); // Récupérer le rôle

    this.expertId = this.getUserId();
    console.log("Expert ID récupéré :", this.expertId); // Vérifier l'ID récupéré
    if (userRole === "expert") {
    if (this.expertId) {
      this.getClientsByExpert(this.expertId);
    }
  }

    this.getAllImages()
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  openNew() {
    this.imageSinistre = new ImageSinistre(
        [],
        [], 
        new Expert('', '', '', '','','',0,'',''),  // Fournir des valeurs par défaut
        new Clients('', '', '', '','','','PersonneMorale'), // Fournir des valeurs par défaut
        new Date(),
        new Documents('', '', '')    // Fournir des valeurs par défaut
    );

    this.submitted = false;
    this.imageSinistreDialog = true;
    this.actionLabel = 'Enregistrer';
}

  getUserId(): string | null {
    return localStorage.getItem('user_id');
  }

  // Récupérer la liste des clients liés à l'expert
  getClientsByExpert(expertId: string): void {
    this.expertService.getExpertById(expertId).subscribe(
      (expert: any) => {
        console.log("Réponse API Expert :", expert);
  
        if (expert && expert.clients && Array.isArray(expert.clients)) {
          const clientIds = expert.clients; // Liste des IDs des clients
          this.clients = [];
  
          clientIds.forEach((clientId: string) => {
            this.authservice.getUserProfile(clientId).subscribe(
              (clientData: any) => {
                this.clients.push(clientData);
                console.log("Client récupéré :", clientData);
              },
              (error) => {
                console.error("Erreur lors de la récupération du client :", error);
              }
            );
          });
        } else {
          console.warn("Aucun client trouvé pour cet expert.");
          this.clients = [];
        }
      },
      (error) => {
        console.error("Erreur lors de la récupération des clients :", error);
      }
    );
  }
  
  

  // Récupérer les documents communs entre le client et l'expert
  getDocumentsCommun(): void {
    if (!this.selectedClientId || !this.expertId) return;
  
    this.expertService.getExpertById(this.expertId).subscribe(
      (expert: any) => {
        this.authservice.getUserProfile(this.selectedClientId!).subscribe(
          (client: any) => {
            const expertDocs = expert.documents || [];
            const clientDocs = client.documents || [];
  
            // Trouver les documents en commun (IDs)
            const documentsCommunIds: string[] = clientDocs.filter((doc: string) => expertDocs.includes(doc));
  
            // Récupérer les objets `Documents` complets
            const requests = documentsCommunIds.map((id: string) => this.documentService.getDocById(id));
  
            forkJoin<Documents[]>(requests).subscribe(
              (documents: Documents[]) => {
                // ✅ Convertir en objets pour forcer la détection
                this.documentsCommun = documents.map(d => Object.assign(new Documents("","",""), d));
                console.log("Documents communs :", this.documentsCommun);
              },
              (error) => {
                console.error("Erreur lors de la récupération des documents :", error);
              }
            );
          },
          (error) => {
            console.error("Erreur lors de la récupération des documents du client :", error);
          }
        );
      },
      (error) => {
        console.error("Erreur lors de la récupération des documents de l'expert :", error);
      }
    );
  }
  

  onFileSelected(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
    console.log("Fichiers sélectionnés:", this.selectedFiles);
  }

  uploadImages(): void {
    if (!this.expertId || !this.selectedClientId || !this.selectedDocument) {
      console.error("Veuillez sélectionner un client et un document avant l'envoi !");
      return;
    }
  
    if (!this.selectedFiles || this.selectedFiles.length === 0) {
      console.error("Erreur : Aucun fichier sélectionné !");
      return;
    }
  
    console.log("Document ID sélectionné :", this.selectedDocument.Id || this.selectedDocument.Id);
  
    const formData = new FormData();
  
    this.selectedFiles.forEach(file => {
      if (file instanceof File) {
        formData.append('image', file);
      } else {
        console.error("Fichier invalide détecté :", file);
      }
    });
  
    // Vérification que les fichiers sont bien ajoutés
    if (!formData.has('image')) {
      console.error("Aucun fichier ajouté à FormData !");
      return;
    }
  
    formData.append('expertId', this.expertId);
    formData.append('clientId', this.selectedClientId);
    formData.append('documentId', this.selectedDocument.Id || this.selectedDocument.Id);
  
    console.log("Données envoyées :");
    formData.forEach((value, key) => console.log(`${key}:`, value));
  
    this.expertService.addImageSinistre(formData).subscribe(
      response => {
        console.log("Images envoyées avec succès :", response);
        this.selectedFiles = [];
        this.selectedDocument = null;
        window.location.reload()
      },
      error => {
        console.error("Erreur lors de l'envoi des images :", error);
      }
    );
  }
  
  
  removeFile(file: File): void {
    this.selectedFiles = this.selectedFiles.filter(f => f !== file);
  }
  
  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }


  
  getAllImages(): void {
    if (!this.expertId) {
      console.error('Aucun ID expert trouvé dans localStorage');
      return;
    }
    if (this.getUserRole()==='expert') {
    this.expertService.getImagesByExpert(this.expertId).subscribe(
      images => {
        console.log("Raw API response:", JSON.stringify(images));

        this.imageSinistres = images;
  
        // Récupérer les détails des experts pour chaque imageSinistre
        this.imageSinistres.forEach((sinistre, index) => {
          this.expertService.getExpertById(sinistre.Expert).subscribe(
            expertData => {
              this.imageSinistres[index].Expert = expertData;
            },
            error => {
              console.error(`Erreur lors de la récupération de l'expert ${sinistre.Expert}:`, error);
            }
          );
        });
  
        console.log("imageSinistres: ", this.imageSinistres);
      },
      error => {
        console.error('Erreur lors de la récupération des images:', error);
      }
    );
  } else if (this.getUserRole()==='PersonnePhysique' || this.getUserRole()==='PersonneMorale'){
    this.authservice.getImagesByClient(this.expertId).subscribe(
      images => {
        this.imageSinistres = images;
  
        // Récupérer les détails des experts pour chaque imageSinistre
        this.imageSinistres.forEach((sinistre, index) => {
          this.authservice.getUserProfile(sinistre.Client).subscribe(
            expertData => {
              this.imageSinistres[index].Client = expertData;
            },
            error => {
              console.error(`Erreur lors de la récupération du client ${sinistre.Client}:`, error);
            }
          );
        });
  
        console.log("imageSinistres: ", this.imageSinistres);
      },
      error => {
        console.error('Erreur lors de la récupération des images:', error);
      }
    );
  } else if (this.getUserRole()==='admin' || this.getUserRole()==='gestionnaire_sinistre') {
    this.imageService.getImagesSinistres().subscribe(
      images => {
        console.log("Raw API response:", JSON.stringify(images));

        this.imageSinistres = images;
  
  
        console.log("imageSinistres: ", this.imageSinistres);
      },
      error => {
        console.error('Erreur lors de la récupération des images:', error);
      }
    );
  }
  }
  
openDialog(images: string[], index: number): void {
  this.imagesList = images;
  this.currentIndex = index;
  this.selectedImage = images[index];
  this.displayDialog = true;
}

previousImage(): void {
  if (this.currentIndex > 0) {
    this.currentIndex--;
    this.selectedImage = this.imagesList[this.currentIndex];
  }
}

nextImage(): void {
  if (this.currentIndex < this.imagesList.length - 1) {
    this.currentIndex++;
    this.selectedImage = this.imagesList[this.currentIndex];
  }
}

ajouterImageAfterAccident() {
  console.log('selectedImages:', this.selectedImages);
  if (this.selectedImages && this.selectedImages.length > 0) {
    const imageSinistre = this.selectedImages[0];
    console.log('imageSinistre:', imageSinistre);
    if (imageSinistre && imageSinistre.Id) {
      const formData = new FormData();
      imageSinistre.ImageAfterAccident.forEach((file: any) => {
        formData.append('imageAfterAccident', file, file.name); // Ajouter chaque fichier à FormData
      });

      this.expertService.ajouterImageAfterAccident(imageSinistre.Id, formData).subscribe(
        (response) => {
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Image ajoutée avec succès' });
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de l’ajout de l’image' });
        }
      );
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'ID du sinistre non défini' });
    }
  } else {
    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez sélectionner une imageSinistre' });
  }
}


onImageSelect(event: any, imageSinistre: any) {
  const files: FileList = event.target.files;
  if (files) {
    imageSinistre.imageAfterAccident = Array.from(files); // Stocker les fichiers directement
    this.selectedImages = [imageSinistre];
    this.ajouterImageAfterAccident();
  }
}


getExpertInfo(expertId: string | null | undefined, docId: string): void {
  if (!expertId) {
    console.error("Aucun ID d'expert fourni.");
    this.expertInfos[docId] = "Il n'y a pas encore un expert affecté";
    return;
  }

  this.expertService.getExpertById(expertId).subscribe(
    (expert: any) => {  
      if (expert) {
        this.expertInfos[docId] = `${expert.nom} ${expert.prenom} `;
      } else {
        this.expertInfos[docId] = "Expert introuvable";
      }
    },
    (error) => {
      this.expertInfos[docId] = "Il n'y a pas d'expert affecté pour le moment";
    }
  );
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


showClientInfo(clientId: string): void {
  if (!clientId) {
      console.error("Aucun ID client fourni.");
      return;
  }

  this.authservice.getUserProfile(clientId).subscribe(
      (client: any) => {
          this.selectedClient = client; // Stocker les données du client
          this.displayClientDialog = true; // Ouvrir le dialog
      },
      (error) => {
          this.selectedClient = { error: "Erreur lors du chargement du client" };
          this.displayClientDialog = true;
      }
  );
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
}
