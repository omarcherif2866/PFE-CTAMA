import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RDV } from 'src/app/components/models/rdv';
import { CalendarOptions } from '@fullcalendar/core';
import { RDVService } from 'src/app/components/services/rdv.service';
import { MessageService } from 'primeng/api';
import { DomSanitizer } from '@angular/platform-browser';
import { Expert } from 'src/app/components/models/expert';
import { Clients } from 'src/app/components/models/clients';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ExpertService } from 'src/app/components/services/expert.service';
import { AuthService } from 'src/app/components/services/auth/auth.service';

@Component({
  selector: 'app-rdv',
  templateUrl: './rdv.component.html',
  styleUrl: './rdv.component.scss'
})
export class RdvComponent {
  displayDialog: boolean = false; // Pour afficher le dialogue
  displayModal: boolean = false;
  selectedDescription: string = '';
  rdvs: RDV[] = [];
  selectedRDVs: RDV[] = [];
  rdv!: RDV 
  rdvDialog: boolean = false;
  rdvForm!: FormGroup;
  submitted: boolean = false;
  actionLabel: string = 'Enregistrer';
  cols: any[] = [];
  rowsPerPageOptions = [5, 10, 20];

  deleteRDVDialog: boolean = false;
  Experts: Expert[] = [];
  clients: Clients[] = [];

  adminId: string | null = null;
  showCalendar: boolean = false;
  events: any[] = [];
  calendarOptions!: CalendarOptions;
  userRole: string | null = null;

  constructor(
    private rdvService: RDVService,private messageService: MessageService,
    private formBuilder: FormBuilder, private sanitizer: DomSanitizer,
    private expertService: ExpertService,
    private clientService: AuthService, 



  ) {}
  ngOnInit() {
    this.rdv = new RDV('',  '', '','', new Expert('','','','','','',0,'',''),new Clients('','','','','','','PersonnePhysique'));
    this.getAllRDVs()
    this.initializeForm();
    this.initializeCalendarOptions();
    // this.getAllExperts()
    this.getAllClients()
    this.userRole = localStorage.getItem('userRole');

  }

  showFullDescription(description: string) {
    this.selectedDescription = description;
    this.displayModal = true;
}

  initializeForm() {
    this.rdvForm = this.formBuilder.group({
      description: [''],
      date: [null, Validators.required],
      heure: [null, Validators.required],  // Ajoutez ce champ ici
      receiver: [null, Validators.required], 

    });
  }
  
  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  getUserId(): string {
    return localStorage.getItem('user_id') || ''; // Retourne l'ID de l'utilisateur connecté
  }


  openNew() {
    this.rdv = new RDV('',  '', '', '',new Expert('','','','','','',0,'',''),new Clients('','','','','','','PersonnePhysique'));
    this.submitted = false;
    this.rdvDialog = true;
    this.actionLabel = 'Enregistrer';

  }

  openRDVDialog(rdv: RDV): void {
    console.log('rdv reçu :', rdv);
  
    this.rdv = new RDV(
      rdv.Id, 
      rdv.Description, 
      rdv.Date, 
      rdv.Heure, 
      rdv.OwnedBy, 
      rdv.Receiver
    );
  
    this.selectedRDVs = [rdv]; 
    this.rdvDialog = true;
  }
  

  editRDV(rdv: RDV) {
    this.rdv = new RDV(
      rdv.Id, 
      rdv.Description, 
      rdv.Date, 
      rdv.Heure, 
      rdv.OwnedBy, 
      rdv.Receiver
    );

      this.rdvForm.patchValue({
          description: rdv.Description,
          date: rdv.Date ? new Date(rdv.Date) : null,
      });

      this.rdvDialog = true;
      this.actionLabel = 'Modifier';
  }

  deleteRDV(rdv: RDV) {
    if (rdv && rdv.Id) {
      this.deleteRDVDialog = true;
      this.rdv = new RDV(
        rdv.Id, 
        rdv.Description, 
        rdv.Date, 
        rdv.Heure, 
        rdv.OwnedBy, 
        rdv.Receiver
      );
        } else {
      console.error('rdv object is missing ID:', rdv);
    }
  }

  confirmDelete() {
    if (this.rdv && this.rdv.Id) {
      this.rdvService.deleteRDV(this.rdv.Id).subscribe(
        response => {
          this.rdvs = this.rdvs.filter(val => val.Id !== this.rdv.Id);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Rendez-vous à été supprimé avec succes', life: 3000 });
          this.rdv = new RDV('',  '', '','', new Expert('','','','','','',0,'',''),new Clients('','','','','','','PersonnePhysique'));
          this.deleteRDVDialog = false;
        },
        error => {
          console.error('Error deleting rdv:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to Delete rdv', life: 3000 });
          this.deleteRDVDialog = false;
        }
      );
    } else {
      console.error('Invalid reunion ID:', this.rdv);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid reunion ID', life: 3000 });
      this.deleteRDVDialog = false;
    }
  }

  hideDialog() {
    this.rdvDialog = false;
    this.submitted = false;
  }

  

  saveRDV(): void {
    this.submitted = true;
  
    if (this.rdvForm.invalid) {
      console.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }
  
    const formData = new FormData();
    formData.append('description', this.rdvForm.get('description')?.value);
  
    // ✅ Formatage de l'heure en "HH:mm"
    const heure = this.rdvForm.get('heure')?.value;
    if (heure instanceof Date) {
      const formattedHeure = heure.toISOString().split('T')[1].substring(0, 5);
      formData.append('heure', formattedHeure);
    } else {
      console.warn("L'heure est invalide ou non définie.");
    }
  
    // ✅ Formatage de la date en "YYYY-MM-DD"
    const date = this.rdvForm.get('date')?.value;
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      formData.append('date', formattedDate);
    } else {
      console.warn('La date est vide ou non définie.');
    }
  
    const userRole = this.getUserRole();
    const userId = this.getUserId();
    let ownedBy = '';
    let receiver: string | null = null;
  
    // ✅ Attribution des rôles
    if (userRole === 'expert') {
      ownedBy = userId;
      receiver = this.rdvForm.get('receiver')?.value?._id || this.rdvForm.get('receiver')?.value;
    } else if (userRole === 'PersonnePhysique' || userRole === 'PersonneMorale') {
      receiver = userId;
      ownedBy = this.rdvForm.get('ownedBy')?.value?._id || this.rdvForm.get('ownedBy')?.value;
    } else {
      console.error("Rôle utilisateur non valide pour la création d'un RDV.");
      return;
    }
  
    formData.append('ownedBy', ownedBy);
    if (receiver) {
      formData.append('receiver', receiver);
    }
  
    if (this.rdv.Id) {
      this.rdvService.putRDV(this.rdv.Id, formData).subscribe(
        res => {
          console.log('Réponse du backend pour la mise à jour du RDV :', res);
          this.rdvDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'RDV mis à jour', life: 3000 });
          this.getAllRDVs();
        },
        error => {
          console.error('Erreur lors de la mise à jour du RDV :', error);
          this.messageService.add({ severity: 'error', summary: 'Erreur lors de la mise à jour du RDV', detail: error.message });
        }
      );
    } else {
      this.rdvService.addRDV(ownedBy, formData).subscribe(
        res => {
          console.log('Réponse du backend pour l\'ajout du RDV :', res);
          this.rdvDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'RDV ajouté', life: 3000 });
          this.getAllRDVs();
        },
        error => {
          console.error('Erreur lors de l\'ajout du RDV :', error);
          this.messageService.add({ severity: 'error', summary: 'Erreur lors de l\'ajout du RDV', detail: error.message });
        }
      );
    }
  }
  
  
  
  
  getAllRDVs(): void {
    this.rdvService.getRDVsByCriteria().subscribe(
      rdvs => {
        console.log('RDVs récupérés:', rdvs);
        
        this.rdvs = rdvs.map(rdv => RDV.fromJSON(rdv)); // Conversion en instances de RDV
  
        this.events = this.rdvs.map(rdv => {
          const eventDate = rdv.Date; // Doit être au format YYYY-MM-DD
          const eventHeure = rdv.Heure; // Doit être au format HH:mm
          const eventDateTime = `${eventDate}T${eventHeure}:00`; // Ajout des secondes pour éviter les erreurs
  
          console.log(`Événement ajouté: ${eventDateTime}`);
  
          return {
            title: `🕒 ${rdv.Heure || 'Rendez-vous'}`,
            start: eventDateTime, // Date et heure combinées correctement
            extendedProps: {
              rdv: rdv,
              ownerEmail: rdv.OwnedBy?.Email,
              receiverEmail: rdv.Receiver?.Email
            }
          };
        });
  
        console.log('Événements du calendrier:', this.events);
        this.initializeCalendarOptions();

      },
      error => {
        console.error('Erreur lors de la récupération des RDVs:', error);
      }
    );
  }
  

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }



  initializeCalendarOptions(): void {
    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      headerToolbar: {
        left: 'prev',
        center: 'title',
        right: 'next',
      },
      initialView: 'dayGridMonth',
      locale: 'fr',
      height: '500px',
      events: this.events, // Utilisation des événements
      eventContent: this.renderEventContent.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventDidMount: (info) => {
        const el = info.el;
        el.style.backgroundColor = '#007bff'; // Bleu
        el.style.color = 'white'; // Texte blanc
        el.style.borderRadius = '5px';
        el.style.padding = '10px';
        el.style.textAlign = 'center'; // Centrer le texte
        el.style.display = 'flex'; // Flexbox pour occuper tout l'espace
        el.style.alignItems = 'center'; // Centrer verticalement
        el.style.justifyContent = 'center'; // Centrer horizontalement
        el.style.height = '100%'; // Remplir toute la cellule
        el.style.cursor='pointer'

        // const rdv = info.event.extendedProps.rdv;
        // const description = rdv?.Description || 'Pas de description';
        // const heure = rdv?.Heure || 'Heure non définie';
        //  el.setAttribute('title', `📅 RDV: ${description}\n🕒 Heure: ${heure}`);

        el.setAttribute('title', `Détails du rendez-vous`);
      }
      
    };
  }
  

  handleEventClick(event: any): void {
    const rdv: RDV = event.event.extendedProps.rdv; // Assurez-vous que les détails du rdv sont stockés ici
    console.log('RDV sélectionné:', rdv); // Pour déboguer
    this.openDialog(rdv); // Ouvrir le dialog avec le rdv sélectionné
}


  onDialogHide() {
    this.selectedRDVs = []; // Réinitialiser les détails des rdvs
  }

  openDialog(rdv: RDV): void {
    console.log('Tentative d\'ouverture du dialog avec le rdv:', rdv); // Avant
    this.selectedRDVs = [rdv]; // Mettre le rdv sélectionné dans un tableau
    this.displayDialog = true; // Afficher le dialog
    console.log('RDV sélectionné:', this.selectedRDVs); // Après
}




renderEventContent(eventInfo: any) {
  const rdv = eventInfo.event.extendedProps.rdv;
  return {
    html: `<div style="font-size: 0.8em; color: white; padding: 5px; border-radius: 3px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
      <b>${eventInfo.event.title}</b>
      ${rdv ? `<br>Avec: ${rdv.Receiver?.Email || 'N/A'}` : ''}
    </div>`
  };
}
  
  

  
    toggleCalendar() {
    this.showCalendar = !this.showCalendar; // Basculer l'affichage du calendrier
  }

  // getAllExperts(): void {
  //   this.expertService.getExpert().subscribe(ss => {
  //     // Afficher les utilisateurs récupérés dans la console
  //     console.log("Users récupérées:", ss);
            
  //     // Afficher les utilisateurs filtrés dans la console pour vérification
  //     console.log("experts filtrés:", this.Experts);
  //   }, error => {
  //     // Gestion des erreurs
  //     console.error("Erreur lors de la récupération des utilisateurs:", error);
  //   });
  // }

  getAllClients(): void {
    this.clientService.getUser().subscribe(ss => {
      // Filtrer les utilisateurs pour ne garder que ceux avec userType = 'client'
      this.clients = ss;
      console.log("clients: ", ss);
    }, error => {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
    });
  }


}