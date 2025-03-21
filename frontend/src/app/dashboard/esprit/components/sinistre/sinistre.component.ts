import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { Documents } from 'src/app/components/models/documents';
import { Sinistre } from 'src/app/components/models/sinistre';
import { DocumentService } from 'src/app/components/services/document.service';
import { SinistreService } from 'src/app/components/services/sinistre.service';

@Component({
  selector: 'app-sinistre',
  templateUrl: './sinistre.component.html',
  styleUrl: './sinistre.component.scss'
})
export class SinistreComponent {


  sinistre!: Sinistre; // Define the sinistre property
  sinistres: Sinistre[] = []; // Define the sinistres property as an array
  selectedSinistres: Sinistre[] = [];


  submitted: boolean = false;

  cols: any[] = [];
  rowsPerPageOptions = [5, 10, 20];

  selectedStatuses: { [key: string]: string } = {}; // Tableau pour stocker les statuts sélectionnés par commande
  statusOptions: any[] = [
    { label: 'déclaration', value: 'déclaration' },
    { label: 'expertise', value: 'expertise' },
    { label: 'reglement', value: 'reglement' },
  ];
  accidentFormData: any;
  selectedPdfName: string = ''; // Stocke le nom du PDF
  selectedPdf: SafeResourceUrl | null = null;
  displayPdfDialog: boolean = false;
  sinistresValides: Sinistre[] = [];

  constructor(
    private sinistreService: SinistreService,
        private messageService: MessageService,
        private documentService: DocumentService,
        private sanitizer: DomSanitizer,
    
  ) {}

    ngOnInit(): void {
  
        this.getAllSinistre()
      }

      // getAllSinistre(): void {
      //   this.sinistreService.getAllSinistre().subscribe(
      //     (data: any[]) => {
      //       this.sinistres = data.map(doc => new Sinistre(
      //         doc._id,
      //         doc.date_survenance,
      //         doc.date_declaration,
      //         doc.num_police,
      //         doc.objet_assure,
      //         doc.description,
      //         doc.status,  // Vérifiez que status existe dans les données
      //         doc.reference,
      //         doc.documents,
      //       ));
      //       console.log('Sinistres:', this.sinistres);  // Vérifiez les données ici
      
      //       // Initialisez selectedStatuses
      //       this.sinistres.forEach(sinistre => {
      //         this.selectedStatuses[sinistre.Id] = sinistre.Status;
      //         if (sinistre.Documents) { // Vérifier si documents existe
      //           this.loadDocuments(sinistre);
      //         }
              
      //       });
      //     },
      //     (error) => {
      //       console.error('Erreur lors de la récupération des documents :', error);
      //     }
      //   );
      // }

      getAllSinistre(): void {
        this.sinistreService.getAllSinistre().subscribe(
            (data: any[]) => {
                // Mapper les sinistres
                this.sinistres = data.map(doc => new Sinistre(
                    doc._id,
                    doc.date_survenance,
                    doc.date_declaration,
                    doc.num_police,
                    doc.objet_assure,
                    doc.description,
                    doc.status,
                    doc.reference,
                    doc.documents
                ));
                
                console.log('Tous les sinistres:', this.sinistres);
    
                // Charger les documents pour chaque sinistre
                this.sinistres.forEach(sinistre => {
                    if (sinistre.Documents) {
                        this.loadDocuments(sinistre);
                    }
                });
    
            },
            (error) => {
                console.error('Erreur lors de la récupération des sinistres :', error);
            }
        );
    }
    
    loadDocuments(sinistre: Sinistre): void {
      this.documentService.getDocById(sinistre.Documents).subscribe(
          (doc: any) => {  // Accepter "any" pour vérifier le type avant conversion
              console.log(`Document brut reçu pour le sinistre ${sinistre.Id}:`, doc);
  
              // Vérifier si doc est bien une instance de Documents
              if (!(doc instanceof Documents)) {
                  doc = new Documents(doc._id, doc.doc, doc.description, doc.status, doc.client, doc.expert);
              }
  
              sinistre.Documents = doc; // Assigner l'objet correctement typé
              console.log(`Document converti pour le sinistre ${sinistre.Id}:`, doc);
              console.log(`Statut du document récupéré : ${doc.Status}`);
  
              // Vérifier si le document a le statut "Validé"
              if (doc.Status === 'Validé') {
                  this.sinistresValides.push(sinistre);
              }
  
              console.log('Sinistres avec documents validés:', this.sinistresValides);
          },
          (error) => {
              console.error('Erreur lors du chargement des documents :', error);
          }
      );
  }
  
    
      
      
          

  onStatusChange(document: Sinistre, event: any) {
    const newStatus = event.value;

    // Loggez l'objet document pour vérifier la présence de l'ID
    console.log('Document:', document);
    console.log('Document ID:', document.Id); // Utilisez le getter Id

    if (!document.Id) {
        console.error('Erreur : L\'ID du document est manquant');
        return;
    }

    this.sinistreService.updateDocStatus(document.Id, newStatus).subscribe(
      (updatedDocument: Sinistre) => {
        console.log('Document mis à jour avec succès :', updatedDocument);
        const index = this.sinistres.findIndex(o => o.Id === updatedDocument.Id);
        if (index !== -1) {
            this.sinistres[index] = updatedDocument;
            this.selectedStatuses[updatedDocument.Id] = updatedDocument.Status;
            // Swal.fire({
            //   icon: 'success',
            //   title: 'Statut modifié',
            //   showConfirmButton: false,
            //   timer: 1500
            // }) 
          }
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Statut modifié', life: 1000 });

          this.getAllSinistre();

    },
    
        (error) => {
            console.error('Erreur lors de la mise à jour du statut du document :', error);
            this.messageService.add({ severity: 'error', summary: 'Erreur lors de la mise à jour du statut' });

        }
    );
}

onGlobalFilter(table: any, event: Event) {
  table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
}






openPdf(pdfPath: string): void {
  this.selectedPdfName = pdfPath; // Stocke le nom du PDF
  const fullPath = `http://localhost:9090/pdf/${pdfPath}`; // Remplace par ton chemin correct
  this.selectedPdf = this.sanitizer.bypassSecurityTrustResourceUrl(fullPath);
  this.displayPdfDialog = true;
}
}
