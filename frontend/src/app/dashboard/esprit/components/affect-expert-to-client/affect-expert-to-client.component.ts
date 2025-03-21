import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Clients } from 'src/app/components/models/clients';
import { Expert } from 'src/app/components/models/expert';
import { AuthService } from 'src/app/components/services/auth/auth.service';
import { ExpertService } from 'src/app/components/services/expert.service';
import { DocumentService } from 'src/app/components/services/document.service'; // Service pour récupérer les documents

@Component({
  selector: 'app-affect-expert-to-client',
  templateUrl: './affect-expert-to-client.component.html',
  styleUrls: ['./affect-expert-to-client.component.scss']
})
export class AffectExpertToClientComponent {
  expertId: string = ''; // ID de l'expert
  clientId: string = ''; // ID du client
  documentId: string = ''; // ID du document sélectionné
  documents: any[] = []; // Tableau pour stocker les documents du client
  Users: Clients[] = [];  // Liste des clients
  experts: Expert[] = []; // Liste des experts

  constructor(
    private expertService: ExpertService,    
    private userService: AuthService, 
    private messageService: MessageService,
    private documentService: DocumentService // Injecter le service pour récupérer les documents
  ) {}

  ngOnInit() {
    const clientId = this.getUserId();
    console.log("Client ID récupéré:", clientId); // 🔍 Vérifier la valeur

    this.getAllClients();
    this.getAllExperts();
  }

  affecterExpert() {
    // this.documentId est déjà l'ID puisqu'on utilise optionValue dans le template
    this.expertService.affecterExpert(this.expertId, this.clientId, this.documentId)
      .subscribe(
        response => {
          console.log('Affectation réussie :', response);
          this.messageService.add({severity: 'success', summary: 'Succès', detail: 'Expert affecté avec succès'});
        },
        error => {
          console.error('Erreur lors de l\'affectation :', error);
          this.messageService.add({severity: 'error', summary: 'Erreur', detail: 'Erreur lors de l\'affectation'});
        }
      );
}

  // Méthode pour récupérer tous les clients
  getAllClients(): void {
    this.userService.getUser().subscribe(ss => {
      // Filtrer les utilisateurs pour ne garder que ceux avec userType = 'client'
      this.Users = ss;
      console.log("clients: ", ss);
    }, error => {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
    });
  }

  // Méthode pour récupérer tous les experts
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

  // Méthode pour récupérer les documents du client sélectionné
  onClientChange(event: any): void {
    this.clientId = event.value; // Récupère l'ID du client sélectionné
    this.getDocumentsByClient(this.clientId); // Récupère les documents associés à ce client
  }

  // Méthode pour récupérer les documents associés à un client
  getDocumentsByClient(client: any): void {
    const clientId = client._id || client.id; // 🔹 Récupère l'ID depuis l'objet
  
    console.log("🔍 Client ID extrait:", clientId);
    console.log("🔍 URL API:", `http://localhost:9090/documents/client/${clientId}`);
  
    this.documentService.getDocumentsByClient(clientId).subscribe(
      documents => {
        // Filtrer les documents pour ne garder que ceux ayant le statut "Validé"
        const validatedDocuments = documents.filter(doc => doc.status === 'Validé');
  
        // Transformation des documents filtrés pour extraire le nom du fichier
        this.documents = validatedDocuments.map(doc => ({
          label: doc.doc,  // Utilisation du champ `doc` comme label pour le dropdown
          value: doc._id   // L'ID du document comme valeur associée
        }));
      },
      error => {
        console.error("❌ Erreur API:", error);
      }
    );
  }
  
  
  
  
  
  getUserId(): string | null {
    return localStorage.getItem('user_id'); // Assurez-vous que 'user_id' est bien stocké sous forme de chaîne
  }
}
