import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';
import { Clients } from 'src/app/components/models/clients';
import { DevisSinistre } from 'src/app/components/models/devis-sinistre';
import { Documents } from 'src/app/components/models/documents';
import { Expert } from 'src/app/components/models/expert';
import { AuthService } from 'src/app/components/services/auth/auth.service';
import { DocumentService } from 'src/app/components/services/document.service';
import { ExpertService } from 'src/app/components/services/expert.service';

@Component({
  selector: 'app-devis-sinistre',
  templateUrl: './devis-sinistre.component.html',
  styleUrl: './devis-sinistre.component.scss'
})
export class DevisSinistreComponent {
  displayModal: boolean = false; // Contrôle la visibilité du modal
  selectedPdfName: string = ''; // Stocke le nom du PDF
  selectedPdf: SafeResourceUrl | null = null;
  displayPdfDialog: boolean = false;

  devisSinistreDialog: boolean = false;
  actionLabel: string = 'Enregistrer';
  deleteDevisDialog: boolean = false;
  devisSinistres: DevisSinistre[] = [];
  devisSinistre!: DevisSinistre
  submitted: boolean = false;
  selectedDevis: DevisSinistre[] = [];
  displayDialog: boolean = false;
 
 
 
  selectedFiles: File[] = [];
  expertId: string | null = null;
  clientId: string | null = null;

  clients: any[] = [];
  experts: any[] = [];
  selectedExpertId: string | null = null;

  documentsCommun: Documents[] = []; // ✅ Correction du type
  selectedDocument: Documents | null = null;
  cols: any[] = [];
  rowsPerPageOptions = [5, 10, 20];

  constructor(private expertService: ExpertService,
              private authservice : AuthService,
              private documentService : DocumentService,
              private sanitizer: DomSanitizer,


  ) {}

  ngOnInit(): void {
    const userRole = this.getUserRole();
    this.clientId = this.getUserId();
    console.log("client ID récupéré :", this.clientId); // Vérifier l'ID récupéré
    if (userRole === "PersonnePhysique" || userRole === "PersonneMorale" ) {
    if (this.clientId) {
      this.getExpertByClient(this.clientId);
    }
  }
    this.getAllDevis()
}

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  openNew() {
    this.devisSinistre = new DevisSinistre(
        [], 
        new Expert('', '', '', '','','',0,'',''),  // Fournir des valeurs par défaut
        new Clients('', '', '', '','','','PersonneMorale'), // Fournir des valeurs par défaut
        new Date(),
        new Documents('', '', '')    // Fournir des valeurs par défaut
    );

    this.submitted = false;
    this.devisSinistreDialog = true;
    this.actionLabel = 'Enregistrer';
}

  getUserId(): string | null {
    return localStorage.getItem('user_id');
  }

  // Récupérer la liste des clients liés à l'expert
  getExpertByClient(clientId: string): void {
    this.authservice.getUserProfile(clientId).subscribe(
      (client: any) => {
        console.log("Réponse API Client :", client);
  
        if (client && client.experts && Array.isArray(client.experts) && client.experts.length > 0) {
          // Réinitialiser la liste des experts
          this.experts = [];
  
          // Récupérer chaque expert associé
          client.experts.forEach((expertId: string) => {
            this.expertService.getExpertById(expertId).subscribe(
              (expertData: any) => {
                this.experts.push(expertData);
                console.log("Expert récupéré :", expertData);
              },
              (error) => {
                console.error(`Erreur lors de la récupération de l'expert ${expertId} :`, error);
              }
            );
          });
        } else {
          console.warn("Aucun expert trouvé pour ce client.");
          this.experts = [];
        }
      },
      (error) => {
        console.error("Erreur lors de la récupération du client :", error);
      }
    );
  }
  
  
  
  

  // Récupérer les documents communs entre le client et l'expert
// Récupérer les documents communs entre le client et l'expert
getDocumentsCommunByClient(): void {
  if (!this.selectedExpertId || !this.clientId) return;

  this.authservice.getUserProfile(this.clientId).subscribe(
    (client: any) => {
      this.expertService.getExpertById(this.selectedExpertId).subscribe(
        (expert: any) => {
          const clientDocs = client.documents || [];
          const expertDocs = expert.documents || [];

          // Trouver les documents en commun (IDs)
          const documentsCommunIds: string[] = clientDocs.filter((doc: string) => expertDocs.includes(doc));

          if (documentsCommunIds.length === 0) {
            this.documentsCommun = [];
            console.warn("Aucun document commun trouvé.");
            return;
          }

          // Récupérer les objets `Documents` complets
          const requests = documentsCommunIds.map((id: string) => this.documentService.getDocById(id));

          forkJoin<Documents[]>(requests).subscribe(
            (documents: Documents[]) => {
              // ✅ Convertir en objets pour forcer la détection des changements
              this.documentsCommun = documents.map(d => Object.assign(new Documents("", "", ""), d));
              console.log("Documents communs :", this.documentsCommun);
            },
            (error) => {
              console.error("Erreur lors de la récupération des documents :", error);
            }
          );
        },
        (error) => {
          console.error("Erreur lors de la récupération des documents de l'expert :", error);
        }
      );
    },
    (error) => {
      console.error("Erreur lors de la récupération des documents du client :", error);
    }
  );
}

  

onFileSelected(event: any): void {
  this.selectedFiles = Array.from(event.target.files);
  console.log("Fichiers PDF sélectionnés :", this.selectedFiles);
}

uploadDevis(): void {
  if (!this.clientId || !this.selectedExpertId || !this.selectedDocument) {
    console.error("Veuillez sélectionner un expert et un document avant l'envoi !");
    return;
  }

  if (!this.selectedFiles || this.selectedFiles.length === 0) {
    console.error("Erreur : Aucun fichier sélectionné !");
    return;
  }

  console.log("Document ID sélectionné :", this.selectedDocument.Id);

  const formData = new FormData();

  this.selectedFiles.forEach(file => {
    if (file instanceof File) {
      if (file.type !== "application/pdf") {
        console.error("Fichier non valide (doit être un PDF) :", file.name);
        return;
      }
      formData.append('devis', file);
    } else {
      console.error("Fichier invalide détecté :", file);
    }
  });

  // Vérification que les fichiers sont bien ajoutés
  if (!formData.has('devis')) {
    console.error("Aucun fichier PDF ajouté à FormData !");
    return;
  }

  formData.append('clientId', this.clientId);
  formData.append('expertId', this.selectedExpertId);
  formData.append('documentId', this.selectedDocument.Id);

  console.log("Données envoyées :");
  formData.forEach((value, key) => console.log(`${key}:`, value));

  this.authservice.addDevisSinistre(formData).subscribe(
    response => {
      console.log("PDF envoyé avec succès :", response);
      this.selectedFiles = [];
      this.selectedDocument = null;
    },
    error => {
      console.error("Erreur lors de l'envoi du PDF :", error);
    }
  );
}

removeFile(file: File): void {
  this.selectedFiles = this.selectedFiles.filter(f => f !== file);
}

openDialog(devis: string[], index: number): void {
  this.displayDialog = true;
}



onGlobalFilter(table: any, event: Event) {
  table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
}

getAllDevis(): void {
  if (!this.clientId) {
    console.error('Aucun ID expert trouvé dans localStorage');
    return;
  }
  if (this.getUserRole()==='expert') {
  this.expertService.getDevisByExpert(this.clientId).subscribe(
    devisList => {
      this.devisSinistres = devisList;
      
      console.log("devisSinistres convertis:", this.devisSinistres);
      
      // Pour chaque devis, récupérer les détails complets de l'expert
      this.devisSinistres.forEach((devis, index) => {
        const expertId = typeof devis.Expert === 'string' ? devis.Expert : devis.Expert.Id;
        
        this.expertService.getExpertById(expertId).subscribe(
          expertData => {
            this.devisSinistres[index].Expert = expertData;
          },
          error => {
            console.error(`Erreur lors de la récupération de l'expert:`, error);
          }
        );
      });
    },
    error => {
      console.error('Erreur lors de la récupération des devis:', error);
    }
  );
  } else if (this.getUserRole()==='PersonnePhysique' || this.getUserRole()==='PersonneMorale'){
    this.authservice.getDevisByClient(this.clientId).subscribe(
      devisList => {
        this.devisSinistres = devisList;
        
        console.log("devisSinistres convertis:", this.devisSinistres);
        
        // Pour chaque devis, récupérer les détails complets de l'expert
        this.devisSinistres.forEach((devis, index) => {
          const clientId = typeof devis.Client === 'string' ? devis.Client : devis.Client.Id;
          
          this.authservice.getUserProfile(clientId).subscribe(
            clientData => {
              this.devisSinistres[index].Client = clientData;
            },
            error => {
              console.error(`Erreur lors de la récupération du client:`, error);
            }
          );
        });
      },
      error => {
        console.error('Erreur lors de la récupération des devis:', error);
      }
    );
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



}