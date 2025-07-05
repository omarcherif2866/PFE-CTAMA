import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { switchMap } from 'rxjs';
import { Gouvernorat } from 'src/app/components/models/agence';
import { Clients } from 'src/app/components/models/clients';
import { Documents } from 'src/app/components/models/documents';
import { Expert } from 'src/app/components/models/expert';
import { PersonneMorale } from 'src/app/components/models/personne-morale';
import { PersonnePhysique } from 'src/app/components/models/personne-physique';
import { Sinistre } from 'src/app/components/models/sinistre';
import { AuthService } from 'src/app/components/services/auth/auth.service';
import { DocumentService } from 'src/app/components/services/document.service';
import { ExpertService } from 'src/app/components/services/expert.service';
import { SharedService } from 'src/app/components/services/shared.service';
import { SinistreService } from 'src/app/components/services/sinistre.service';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {
  documentForm!: FormGroup;
  clients: Clients[] = [];
  experts: Expert[] = [];
  selectedFile!: File | null;
  displayPdfDialog: boolean = false;
  selectedPdf: SafeResourceUrl | null = null;

  displayModal: boolean = false; // Contrôle la visibilité du modal

  documentDialog: boolean = false;
  actionLabel: string = 'Enregistrer';
  deleteDocumentsDialog: boolean = false;
  documents: Documents[] = [];
  document!: Documents
  sinistre!: Sinistre; // Define the sinistre property
  sinistres: Sinistre[] = []; // Define the sinistres property as an array

  selectedDocuments: Documents[] = [];
  documentImageUrl!: string; // Déclaration de l'URL de l'image du document

  submitted: boolean = false;
  clientInfos: { [key: string]: string } = {}; // Information du client à afficher
  expertInfos: { [key: string]: string } = {};  // Stocke les infos par document ID

  cols: any[] = [];
  rowsPerPageOptions = [5, 10, 20];
  selectedPdfName: string = ''; // Stocke le nom du PDF
  selectedStatuses: { [key: string]: string } = {}; // Tableau pour stocker les statuts sélectionnés par commande
  statusOptions: any[] = [
    { label: 'En attente', value: 'En attente' },
    { label: 'Validé', value: 'Validé' },
    { label: 'Non validé', value: 'Non Validé' },
  ];
  accidentFormData: any;

  displayClientDialog: boolean = false;
  selectedClient: any = null;

  displayExpertDialog: boolean = false;
  selectedExpert: any = null;
  selectedExperts: { [key: string]: string } = {}; // Stocke les experts sélectionnés par document
  referenceSinistres: { [key: string]: string } = {};
  gouvernoratOptions: { label: string, value: Gouvernorat }[] = [];

  constructor(
    private fb: FormBuilder,
    private documentService: DocumentService,
    private sinistreService: SinistreService,
    private clientService: AuthService,
    private expertService: ExpertService,
    private messageService: MessageService,
    private sanitizer: DomSanitizer,
    private sharedService: SharedService

  ) {            
    // or fetch the sinistres from a service
  }

  ngOnInit(): void {
    const userId = this.getUserId(); // Récupérer l'ID du client connecté

    this.documentForm = this.fb.group({
      client: [userId, Validators.required], // Assigner l'ID directement
      description: ['', Validators.required],
      reference: ['', Validators.required],
      gouvernorat: ['', Validators.required]

    });

    // this.accidentFormData = this.sharedService.getFormDataFromLocalStorage();
    // console.log('Données récupérées dans DocumentsComponent:', this.accidentFormData); // Journal de débogage

    // this.sharedService.currentFormData.subscribe(data => {
    //   this.accidentFormData = data;
    //   console.log('Données récupérées dans DocumentsComponent après mise à jour:', this.accidentFormData); // Journal de débogage
    // });

      this.document = new Documents('', '', '');
      this.getAllDocuments();
      // this.getClientInfo();
    // this.loadClients();
    this.getAllExperts();
    this.getGouvernaurat();

  }

  openNew() {
    this.document = new Documents('', '', '');

    this.submitted = false;
    this.documentDialog = true;
    this.actionLabel = 'Enregistrer';

  }

  hideDialog() {
    this.documentDialog = false;
    this.submitted = false;
  }

  getClientInfo(clientId: string | null | undefined, docId: string): void {
    if (clientId) {
      this.clientService.getUserProfile(clientId).subscribe(
        (client: any) => {  // Utilisation de "any" si la classe Clients ne correspond pas exactement
          if (client.typeClient === 'PersonnePhysique') {
            this.clientInfos[docId] =`${client.nom} ${client.prenom} ${client.phoneNumber} `;
          } else if (client.typeClient === 'PersonneMorale') {
            this.clientInfos[docId] = `Matricule Fiscal: ${client.matricule_fiscal}`;
          } else {
            this.clientInfos[docId] = 'Client inconnu';
          }
        },
        (error) => {
          console.error('Erreur lors de la récupération du client:', error);
          this.clientInfos[docId] = 'Erreur lors du chargement du client';
        }
      );
    } else {
      console.error('Aucun ID utilisateur trouvé dans le localStorage.');
      this.clientInfos[docId] = 'Aucun client trouvé';
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
  
  

  getAllDocuments(): void {
    this.documentService.getAllDocuments().subscribe(
      (data: any[]) => {
        console.log("Données récupérées avant mapping :", data); // Vérification
  
        this.documents = data.map(doc => new Documents(
          doc._id?.$oid || doc._id,  // Extraction de l'ID du document
          doc.doc,
          doc.description,
          doc.status,
          doc.client?.$oid || doc.client,  // Extraction de l'ID du client
          doc.expert?.$oid || doc.expert,   // Extraction de l'ID de l'expert
          doc.gouvernorat,

        ));
  
        console.log("Documents après mapping :", this.documents); // Vérification
  
        this.documents.forEach(doc => {
          this.selectedStatuses[doc.Id] = doc.Status;
        
          // Vérification et extraction correcte de l'ID de l'expert
          const expertId = doc.Expert && typeof doc.Expert === 'object' ? String(doc.Expert.Id) : String(doc.Expert);
          const clientId = doc.Client && typeof doc.Client === 'object' ? String(doc.Client.Id) : String(doc.Client);
          if (clientId) {  
            this.getClientInfo(clientId, doc.Id);  // Passer l'ID extrait
          }
          if (expertId) {  
            this.getExpertInfo(expertId, doc.Id);  // Passer l'ID extrait
          }
        });
        
      },
      (error) => {
        console.error('Erreur lors de la récupération des documents :', error);
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


  onFileSelect(event: any): void {
    if (event.files && event.files.length > 0) {
      this.selectedFile = event.files[0];
    }
  }

  onSubmit(): void {
    if (this.documentForm.invalid || !this.selectedFile) return;
  
    const formData = new FormData();
    formData.append('doc', this.selectedFile);
    formData.append('client', this.documentForm.value.client);
    formData.append('description', this.documentForm.value.description);
    formData.append('reference', this.documentForm.value.reference);
    formData.append('gouvernorat', this.documentForm.value.gouvernorat);
  
    console.log('Référence envoyée:', this.documentForm.value.reference);
  
    // D'abord vérifier si le sinistre existe avec cette référence
    this.sinistreService.getSinistreByReference(this.documentForm.value.reference)
      .pipe(
        switchMap(sinistre => {
          if (!sinistre) {
            throw new Error('Référence sinistre invalide');
          }
          // Si le sinistre existe, créer le document
          return this.documentService.createDocument(formData).pipe(
            switchMap(document => {
              // Ajouter le document au sinistre
              sinistre.documents = document;
              console.log('Référence du sinistre pour mise à jour:', sinistre.reference);
              return this.sinistreService.putSinistre(sinistre.reference, sinistre);
              
            })
          );
        })
      )
      .subscribe({
        next: (response) => {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Document ajouté avec succès'
          });
          window.location.reload()
          // this.getAllDocuments();
        },
        error: (error) => {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Erreur', 
            detail: 'Référence sinistre invalide ou erreur lors de l\'ajout du document' 
          });
        }
      });
  }



  getUserId(): string | null {
    return localStorage.getItem('user_id');
  }

  openPdf(pdfPath: string): void {
    this.selectedPdfName = pdfPath; // Stocke le nom du PDF
    const fullPath = `http://localhost:9090/pdf/${pdfPath}`; // Remplace par ton chemin correct
    this.selectedPdf = this.sanitizer.bypassSecurityTrustResourceUrl(fullPath);
    this.displayPdfDialog = true;
  }



  affecterExpert(documentId: string, clientId: string, expertId: string): void {
    if (!expertId) return; // Ne rien faire si aucun expert sélectionné
  
    this.expertService.affecterExpert(expertId, clientId, documentId)
      .subscribe(
        response => {
          console.log('Affectation réussie :', response);
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Expert affecté avec succès' });
          window.location.reload()

        },
        error => {
          console.error('Erreur lors de l\'affectation :', error);
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de l\'affectation' });
        }
      );
  }




  onStatusChange(document: Documents, event: any) { 
    const newStatus = event.value;
  
    if (!document.Id) {
        console.error("Erreur : L'ID du document est manquant");
        return;
    }
  
    console.log("Status changé vers:", newStatus);
  
    if (newStatus === "Non Validé") {
        console.log("Recherche du sinistre pour le document:", document.Id);
  
        this.sinistreService.getSinistreByDocument(document.Id).subscribe(
            (sinistre: Sinistre) => {
              console.log("Résultat de la recherche :", sinistre);
              if (sinistre && (sinistre as any)._id) {
                console.log("Sinistre trouvé, tentative de suppression:", (sinistre as any)._id);
                this.sinistreService.deleteSinistre((sinistre as any)._id).subscribe(
             // Utilisation du getter Id
                        () => {
                            console.log("Sinistre supprimé avec succès");
                            this.messageService.add({
                                severity: "success",
                                summary: "Succès",
                                detail: "Sinistre supprimé",
                                life: 1000
                            });
                            this.getAllDocuments();
                        },
                        (error) => {
                            console.error("Erreur lors de la suppression du sinistre :", error);
                            this.messageService.add({
                                severity: "error",
                                summary: "Erreur",
                                detail: "Erreur lors de la suppression du sinistre"
                            });
                        }
                    );
                } else {
                    console.log("Aucun sinistre trouvé pour ce document");
                }
            },
            (error) => {
                console.error("Erreur lors de la récupération du sinistre :", error);
                this.messageService.add({
                    severity: "error",
                    summary: "Erreur",
                    detail: "Erreur lors de la récupération du sinistre"
                });
            }
        );
    }
  
    this.documentService.updateDocStatus(document.Id, newStatus).subscribe(
        (updatedDocument: Documents) => {
            console.log("Document mis à jour avec succès :", updatedDocument);
            this.messageService.add({
                severity: "success",
                summary: "Succès",
                detail: "Statut modifié",
                life: 1000
            });
            this.getAllDocuments();
        },
        (error) => {
            console.error("Erreur lors de la mise à jour du statut du document :", error);
            this.messageService.add({
                severity: "error",
                summary: "Erreur",
                detail: "Erreur lors de la mise à jour du statut"
            });
        }
    );
}


showClientInfo(clientId: string): void {
  if (!clientId) {
      console.error("Aucun ID client fourni.");
      return;
  }

  this.clientService.getUserProfile(clientId).subscribe(
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

showExpertInfo(expertId: string): void {
  if (!expertId) {
      console.error("Aucun ID Expert fourni.");
      return;
  }

  this.expertService.getExpertById(expertId).subscribe(
      (expert: any) => {
          this.selectedExpert = expert; // Stocker les données du client
          this.displayExpertDialog = true; // Ouvrir le dialog
      },
      (error) => {
          this.selectedExpert = { error: "Erreur lors du chargement du client" };
          this.displayExpertDialog = true;
      }
  );
}

getUserRole(): string | null {
  return localStorage.getItem('userRole');
}



modifierReference(documentId: string) {
  if (!documentId || !this.referenceSinistres[documentId]) {
      console.error("ID ou référence invalide :", documentId, this.referenceSinistres[documentId]);
      return;
  }
  
  // First get the sinistre ID from the document ID
  this.sinistreService.getSinistreByDocument(documentId).subscribe(
      (sinistre: any) => {
          // Use _id from the response directly, not the getter method
          const sinistreId = sinistre._id;
          
          if (!sinistreId) {
              console.error("ID du sinistre non trouvé dans la réponse", sinistre);
              alert("Impossible de trouver l'ID du sinistre");
              return;
          }
          
          // Then update the reference using the sinistre ID
          this.sinistreService.updateReference(sinistreId, this.referenceSinistres[documentId]).subscribe(
              (response) => {
                  console.log("Référence mise à jour avec succès :", response);
                  this.messageService.add({
                    severity: "success",
                    summary: "Succès",
                    detail: "Référence Phoenix mise à jour avec succès",
                    life: 1000
                });
              },
              (error) => {
                  console.error("Erreur lors de la mise à jour de la référence", error);
                  this.messageService.add({
                    severity: "error",
                    summary: "Erreur",
                    detail: "Erreur lors de la mise à jour de la référence"
                });
              }
          );
      },
      (error) => {
          console.error("Erreur lors de la récupération du sinistre", error);
          alert('Erreur lors de la récupération du sinistre');
      }
  );
}




updateSinistreReference(sinistreId: string, newReference: string) {
  this.sinistreService.updateReference(sinistreId, newReference).subscribe({
    next: (updatedSinistre) => {
      console.log('Sinistre mis à jour :', updatedSinistre);
      alert('Référence mise à jour avec succès');
    },
    error: (error) => {
      console.error('Erreur lors de la mise à jour du sinistre', error);
      alert('Erreur lors de la mise à jour');
    }
  });
}


generateOrdreMission(documentId: string, docName: string) {
  if (!documentId) {
    console.error('ID du document non défini');
    return;
  }

  console.log('Génération de l\'ordre de mission pour le document ID:', documentId);

  this.expertService.generateOrdeMission(documentId).subscribe({
    next: (blob: Blob) => {
      if (blob.size === 0) {
        console.error('Le fichier PDF reçu est vide');
        return;
      }

      // Vérifie que c'est un PDF
      if (blob.type !== 'application/pdf') {
        console.warn('Le fichier reçu n\'est pas un PDF', blob.type);
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Ordre_de_mission-${docName}`; // ✅ ici on utilise le nom reçu
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    error: (error) => {
      console.error('Erreur lors du téléchargement du PDF:', error);
    }
  });
}

  getGouvernaurat(){
    this.gouvernoratOptions = Object.values(Gouvernorat).map(gouv => ({
      label: gouv,  // Ce qui est affiché dans le menu déroulant
      value: gouv   // La valeur stockée dans `agence.Gouvernorat`
    }));
  
  }

}