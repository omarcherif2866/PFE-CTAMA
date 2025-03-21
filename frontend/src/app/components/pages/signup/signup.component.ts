import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AuthService } from 'src/app/components/services/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',

})
export class SignupComponent {
  form!: FormGroup;
  formPM!: FormGroup;
  showPPForm: boolean = false; // Déclaration et initialisation de showPPForm à false
  showPMForm: boolean = false; // Déclaration et initialisation de showPPForm à false

  hoveredElement: string | null = null;

  text: string = 'Bonjour Monsieur';

  @Output() switchToSignin = new EventEmitter<void>();
  @Output() signUpSuccess = new EventEmitter<void>(); // Nouvel événement



  constructor(private fb: FormBuilder, private userService: AuthService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      nom: ['', Validators.required],  // Le nom de la personne
      prenom: ['', Validators.required],  // Le prénom de la personne
      email: ['', [Validators.required, Validators.email]],  // L'email
      phoneNumber: ['', Validators.required],  // Le numéro de téléphone
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],  // Le mot de passe
      confirmPassword: ['', Validators.required],  // La confirmation du mot de passe
      adresse: ['', Validators.required],  // L'adresse de la personne
      numeroPermis: ['', Validators.required],  // Le numéro de permis de conduire
      identifiant_national: ['', Validators.required],  // Identifiant national
      CIN_Pass: ['', Validators.required],  // CIN ou passeport
      sex: ['', Validators.required],  // Le sexe (homme/femme)
      nationalite: ['', Validators.required],  // La nationalité
      profession: ['', Validators.required],  // La profession
      image: [null, Validators.required],  // L'image de profil
      typeClient: ['PersonnePhysique'],  // Définir le type de client (par défaut 'client')
      birthDate: ['', Validators.required],

    });
    

    this.formPM = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      confirmPassword: ['', Validators.required],
      adresse: ['', Validators.required],
      raisonSociale: ['', Validators.required],
      activite: ['', Validators.required],
      matricule_fiscal: ['', Validators.required],
      image: [null, Validators.required],
      typeClient: ['PersonneMorale']  // Ajout de userType avec la valeur 'client'

    });


  }



  onHover(element: string | null) {
    this.hoveredElement = element;
  }


  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;

    if (!passwordValid) {
      return { passwordStrength: true };
    }

    return null;
  }

  creerCompte() {
    if (this.form.valid) {
      const formData = new FormData();
  
      // Ajouter les champs généraux
      formData.append('nom', this.form.value.nom);
      formData.append('prenom', this.form.value.prenom); // Ajout du champ prénom
      formData.append('email', this.form.value.email);
      formData.append('phoneNumber', this.form.value.phoneNumber);
      formData.append('password', this.form.value.password);
      formData.append('confirmPassword', this.form.value.confirmPassword);
      formData.append('adresse', this.form.value.adresse); // Ajout du champ adresse
      formData.append('typeClient', this.form.value.typeClient); // Par défaut 'client'
      formData.append('birthDate', this.form.value.birthDate);

      // Champs spécifiques à PersonnePhysique
      formData.append('numeroPermis', this.form.value.numeroPermis);
      formData.append('identifiant_national', this.form.value.identifiant_national);
      formData.append('CIN_Pass', this.form.value.CIN_Pass);
      formData.append('sex', this.form.value.sex);
      formData.append('nationalite', this.form.value.nationalite);
      formData.append('profession', this.form.value.profession);
  
      // Ajout de l'image
      if (this.form.value.image instanceof File) {
        formData.append('image', this.form.value.image);
      } else {
        console.error('Le champ image doit être un fichier');
      }
  
      // Appel du service pour créer un compte
      this.userService.createAcount(formData).subscribe(
        res => {
          this.signUpSuccess.emit();
          Swal.fire({
            icon: 'success',
            title: 'Vous êtes inscrit avec succès',
            showConfirmButton: false,
            timer: 1500,
          });
          window.location.reload();
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'Vérifiez vos données',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      );
    } else {
      // Collecte des champs invalides
      const invalidFields = Object.keys(this.form.controls).filter(field => this.form.get(field)?.invalid);
    
      // Créer une liste de messages d'erreur
      let errorMessages = '';
      invalidFields.forEach(field => {
        const errorMessage = this.getErrorMessage(field);
        errorMessages += `- ${errorMessage}\n`;  // Ajouter un saut de ligne pour chaque message
      });
    
      // Affichage du Swal avec tous les messages d'erreur
      if (errorMessages) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur de validation',
          text: errorMessages,
          showConfirmButton: true,
        });
      }
    }
  }
  
  
  getErrorMessage(field: string): string {
    const control = this.form.get(field);
  
    // Définir les libellés lisibles pour chaque champ
    const fieldLabels: { [key: string]: string } = {
      nom: 'Nom',
      email: 'Email',
      phoneNumber: 'Numéro de téléphone',
      password: 'Mot de passe',
      confirmPassword: 'Confirmation du mot de passe',
      companyName: "Nom de l'entreprise",
      industry: "Secteur d'activité",
      position: 'Poste occupé',
      servicesNeeded: 'Types de services recherchés',
      mainObjectives: 'Objectifs principaux',
      estimatedBudget: 'Budget estimé',
      image: 'Image',
    };
  
    const fieldName = fieldLabels[field] || field; // Utilise un libellé lisible ou le nom brut
  
    if (control?.hasError('required')) {
      return `${fieldName} est requis.`;
    }
    if (control?.hasError('email')) {
      return `Veuillez entrer une adresse email valide.`;
    }
    if (control?.hasError('minlength')) {
      return `${fieldName} doit comporter au moins ${control.errors?.['minlength'].requiredLength} caractères.`;
    }
    if (control?.hasError('pattern')) {
      return `Format invalide pour ${fieldName}.`;
    }
    if (field === 'estimatedBudget' && control?.value === 0) {
      return `${fieldName} ne peut pas être égal à 0.`;
    }
    return '';
  }

  creerComptePM() {    
    if (this.formPM.valid) {
      const formData = new FormData();
  
      // Ajouter les champs généraux
      formData.append('adresse', this.formPM.value.adresse); // Ajout du champ prénom
      formData.append('email', this.formPM.value.email);
      formData.append('activite', this.formPM.value.activite);
      formData.append('phoneNumber', this.formPM.value.phoneNumber);
      formData.append('password', this.formPM.value.password);
      formData.append('confirmPassword', this.formPM.value.confirmPassword);
      formData.append('matricule_fiscal', this.formPM.value.matricule_fiscal); // Ajout du champ adresse
      formData.append('typeClient', this.formPM.value.typeClient); // Par défaut 'client'
      formData.append('raisonSociale', this.formPM.value.raisonSociale);
 
      // Ajout de l'image
      if (this.formPM.value.image instanceof File) {
        formData.append('image', this.formPM.value.image);
      } else {
        console.error('Le champ image doit être un fichier');
      }
  
      // Appel du service pour créer un compte
      this.userService.createAcount(formData).subscribe(
        res => {
          this.signUpSuccess.emit();
          Swal.fire({
            icon: 'success',
            title: 'Vous êtes inscrit avec succès',
            showConfirmButton: false,
            timer: 1500,
          });
          window.location.reload();
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'Vérifiez vos données',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      );
    } else {
      // Collecte des champs invalides
      const invalidFields = Object.keys(this.formPM.controls).filter(field => this.formPM.get(field)?.invalid);
    
      // Créer une liste de messages d'erreur
      let errorMessages = '';
      invalidFields.forEach(field => {
        const errorMessage = this.getErrorMessagePM(field);
        errorMessages += `- ${errorMessage}\n`;  // Ajouter un saut de ligne pour chaque message
      });
    
      // Affichage du Swal avec tous les messages d'erreur
      if (errorMessages) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur de validation',
          text: errorMessages,
          showConfirmButton: true,
        });
      }
    }
  }



  
  getErrorMessagePM(field: string): string {
    const control = this.formPM.get(field);
  
    const fieldLabels: { [key: string]: string } = {
      nom: 'Nom',
      email: 'Email',
      phoneNumber: 'Numéro de téléphone',
      password: 'Mot de passe',
      confirmPassword: 'Confirmation du mot de passe',
      companyName: "Nom de l'entreprise",
      industry: "Secteur d'activité",
      position: 'Poste occupé',
      partnershipType: 'Type de partenariat',
      partnershipObjectives: 'Objectifs du partenariat',
      availableResources: 'Ressources disponibles',
      image: 'Image',
    };
  
    const fieldName = fieldLabels[field] || field; // Utilise un libellé lisible ou le nom brut
  
    if (control?.hasError('required')) {
      return `${fieldName} est requis.`;
    }
    if (control?.hasError('email')) {
      return `Veuillez entrer une adresse email valide.`;
    }
    if (control?.hasError('minlength')) {
      return `${fieldName} doit comporter au moins ${control.errors?.['minlength'].requiredLength} caractères.`;
    }
    if (control?.hasError('pattern')) {
      return `Format invalide pour ${fieldName}.`;
    }
    return '';
  }
  

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ image: file });
    }
  }



  onFileChangePM(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.formPM.patchValue({ image: file });
    }
  }


  get signupPassword() {
    return this.form.get('password');
  }



getImageUrl(imageName?: string): string {
  if (imageName && !imageName.startsWith('assets/')) {
    return `${imageName}`;
  }
  return imageName ? imageName : 'assets/img/default-image.png';
}


onSigninClick(): void {
  // Émettre l'événement pour dire au parent d'ouvrir le dialog de connexion
  this.switchToSignin.emit();
}


}