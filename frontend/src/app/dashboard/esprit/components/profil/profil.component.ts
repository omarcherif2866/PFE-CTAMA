import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { Clients } from 'src/app/components/models/clients';
import { PersonnePhysique } from 'src/app/components/models/personne-physique';
import { PersonneMorale } from 'src/app/components/models/personne-morale';
import { AuthService } from 'src/app/components/services/auth/auth.service';
import { Expert } from 'src/app/components/models/expert';
import { ExpertService } from 'src/app/components/services/expert.service';

@Component({
  providers: [MessageService],
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  uploadedFiles: File[] = [];
  form: any = {};
  client!: Clients;
  expert!: Expert;

  clientId: string | null = null;
  messages: Message[] = [];

  constructor(private userService: AuthService, private messageService: MessageService, 
    private expertService: ExpertService,   private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.clientId = this.getUserId();
    const userRole = this.getUserRole(); // Récupérer le rôle
  console.log("userRole:",userRole)
    if (this.clientId) {
      if (userRole === 'expert') {
        console.log('Calling getExpertById with ID:', this.clientId);
        this.expertService.getExpertById(this.clientId).subscribe({
          next: (data: any) => {
            console.log('API Response (Expert):', data);
            this.expert = this.mapExpertToModel(data);
            console.log('Mapped expert object:', this.expert);
            this.fillFormWithUserData();
          },
          error: (err) => {
            console.error('Error fetching expert profile:', err);
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Erreur', 
              detail: 'Impossible de charger le profil de l\'expert' 
            });
          }
        });
      } else {
        // Sinon, utiliser getUserProfile
        this.userService.getUserProfile(this.clientId).subscribe({
          next: (data: any) => {
            console.log('API Response (Client):', data);
            this.client = this.mapApiResponseToModel(data);
            this.fillFormWithUserData();
          },
          error: (err) => {
            console.error('Error fetching user profile:', err);
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Erreur', 
              detail: 'Impossible de charger le profil utilisateur' 
            });
          }
        });
      }
    }
  }
  

  mapApiResponseToModel(data: any): Clients {
    const userRole = this.getUserRole();
    
    if (userRole === 'PersonneMorale') {
      return new PersonneMorale(
        data._id,
        data.email,
        '', 
        data.image || '',
        data.phoneNumber,
        data.adresse,
        data.raisonSociale,
        data.activite,
        data.matricule_fiscal,
        'PersonneMorale'
      );
    } else {
      return new PersonnePhysique(
        data._id,
        data.email,
        '',  
        data.image || '',
        data.phoneNumber,
        data.adresse,
        data.nom,
        data.prenom,
        data.birthDate,
        data.numeroPermis,
        data.identifiant_national,
        data.CIN_Pass,
        data.sex,
        data.nationalite,
        data.profession,
        'PersonnePhysique'
      );
    }
  }

  mapExpertToModel(data: any): Expert {
    const expert = new Expert(
      data._id,
      data.email,
      "",
      data.image || '',
      data.phoneNumber,
      data.region,
      data.taux,
      data.nom,
      data.prenom,
    );
    console.log('Mapped expert data:', expert);
    return expert;
  }
  
  

  fillFormWithUserData(): void {
    console.log('Current client data:', this.client);
    console.log('Current expert data:', this.expert);

    // Initialize form with empty values
    this.form = {
      email: '',
      phoneNumber: '',
      image: '',
      nom: '',
      prenom: '',
      region: '',
      taux: 0
    };

    const userRole = this.getUserRole();
    console.log('User Role:', userRole);

    if (userRole === 'expert' && this.expert) {
      console.log('Filling form with expert data:', this.expert);
      
      // Debug logging to see which properties are accessible
      console.log('Expert email direct:', this.expert.Email);
      console.log('Expert email getter:', this.expert.Email);
      
      // Try both property access methods
      this.form = {
        email: this.expert.Email ,
        nom: this.expert.Nom ,
        prenom: this.expert.Prenom ,
        phoneNumber: this.expert.PhoneNumber ,
        taux: this.expert.Taux ,
        region: this.expert.Region ,
        image: this.expert.Image 
      };
    } else if (this.client) {
      // Common fields for client
      this.form = {
        email: this.client.Email,
        phoneNumber: this.client.PhoneNumber,
        adresse: this.client.Adresse,
        image: this.client.Image
      };
      
      if (userRole === 'PersonnePhysique') {
        const physique = this.client as PersonnePhysique;
        Object.assign(this.form, {
          nom: physique.Nom,
          prenom: physique.Prenom,
          birthDate: physique.BirthDate,
          numeroPermis: physique.NumeroPermis,
          identifiant_national: physique.IdentifiantNational,
          CIN_Pass: physique.CINPass,
          sex: physique.Sex,
          nationalite: physique.Nationalite,
          profession: physique.Profession
        });
      } else if (userRole === 'PersonneMorale') {
        const morale = this.client as PersonneMorale;
        Object.assign(this.form, {
          raisonSociale: morale.RaisonSociale,
          activite: morale.Activite,
          matricule_fiscal: morale.MatriculeFiscal
        });
      }
    }

    console.log('Form data after filling:', this.form);
    this.changeDetectorRef.detectChanges();
  }

  

  onSubmit(): void {
    console.log('Form data being submitted:', this.form);
  
    if (this.clientId) {
      const formData = new FormData();
      
      Object.keys(this.form).forEach(key => {
        if (key !== 'image' && this.form[key] !== undefined && this.form[key] !== null) {
          formData.append(key, this.form[key]);
        }
      });
  
      if (this.uploadedFiles && this.uploadedFiles.length > 0) {
        formData.append('image', this.uploadedFiles[0]);
      }
  
      const userRole = this.getUserRole();
      
      if (userRole === 'expert') {
        // Use expert service for experts
        this.expertService.putExpert(this.clientId, formData).subscribe({
          next: (updatedExpert: any) => {
            console.log('Updated expert data:', updatedExpert);
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Succès', 
              detail: 'Profil expert mis à jour avec succès', 
              life: 3000 
            });
            this.expert = this.mapExpertToModel(updatedExpert);
            this.fillFormWithUserData();
          },
          error: (error) => {
            console.error('Error updating expert profile:', error);
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Error', 
              detail: 'Profil expert n\'est pas mis à jour', 
              life: 3000 
            });
          }
        });
      } else {
        // Use user service for clients
        this.userService.updateUserProfile(this.clientId, formData).subscribe({
          next: (updatedUser: any) => {
            console.log('Updated user data:', updatedUser);
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Succès', 
              detail: 'Profil utilisateur mis à jour avec succès', 
              life: 3000 
            });
            this.client = this.mapApiResponseToModel(updatedUser);
            this.fillFormWithUserData();
          },
          error: (error) => {
            console.error('Error updating profile:', error);
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Error', 
              detail: 'Profil utilisateur n\'est pas mis à jour', 
              life: 3000 
            });
          }
        });
      }
    }
  }

  getUserId(): string | null {
    return localStorage.getItem('user_id');
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  onFileSelected(event: any): void {
    if (event.files?.[0]) {
      this.uploadedFiles = [event.files[0]];
    }
  }

  getImageUrl(imageName: string): string {
    return imageName || '/assets/default-profile.png';
  }
}