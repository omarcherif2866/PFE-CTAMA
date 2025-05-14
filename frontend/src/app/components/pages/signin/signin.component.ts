import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/components/services/auth/auth.service';
import Swal from 'sweetalert2';
import { Clients } from '../../models/clients';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-signin',

  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent implements OnInit{
  password!: string;
  form!: FormGroup;
  user!: Clients;

  displaySignupDialog: boolean = false;
  emailError: string = '';
  passwordError: string = '';

  isSwapVisible: boolean = false; // Contrôle la visibilité du swap
  @Output() switchToSignup = new EventEmitter<void>();
  @Output() signInSuccess = new EventEmitter<void>(); // Nouvel événement
  @Output() closeDialogOnError = new EventEmitter<void>();  // Nouvel événement
  @Output() onOpenSigninDialog = new EventEmitter<void>();  // Émetteur d'événements




  constructor( private formBuilder: FormBuilder, private service: AuthService, private router: Router,
    private route: ActivatedRoute, private messageService: MessageService,
      ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

  }

  // async signin() {
  //   if (this.form.valid) {
  //     const t = {
  //       email: this.form.value.email,
  //       password: this.form.value.password,
  //     };
  
  //     try {
  //       const data = await this.service.signIn(t).toPromise();
  //       console.log('Sign-in response:', data);
  
  //       this.signInSuccess.emit();
  
  //       Swal.fire({
  //         icon: 'success',
  //         title: 'Vous êtes connecté',
  //         showConfirmButton: false,
  //         timer: 1500
  //       });

  //       // window.location.reload();
  //       // Rediriger après la connexion réussie
  //       const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  //       this.router.navigateByUrl(returnUrl);
  
  //     } catch (error) {
  //       // Stocker le message d'erreur pour l'afficher sous le champ mot de passe
  //       this.errorMessage = error instanceof Error ? error.message : String(error);
  //     }
  //   }
  // }
  

  
  
  
  
  
  
  

  signin() {
    // Réinitialiser les messages d'erreur
    this.emailError = '';
    this.passwordError = '';
    
    if (this.form.valid) {
      const credentials = {
        email: this.form.value.email,
        password: this.form.value.password,
      };
  
      this.service.signIn(credentials).subscribe({
        next: (data) => {
          this.signInSuccess.emit();
          Swal.fire({
            icon: 'success',
            title: 'Vous êtes connecté',
            showConfirmButton: false,
            timer: 1500
          });
        },
        error: (error) => {
          const errorMessage = error.message || 'Une erreur est survenue';
          
          // Déterminer le type d'erreur en fonction du message
          if (errorMessage.includes('Mot de passe incorrect')) {
            this.passwordError = errorMessage;
          } else if (errorMessage.includes('Adresse email incorrecte')) {
            this.emailError = errorMessage;
          } else if (errorMessage.includes('Compte temporairement verrouillé')) {
            this.signInSuccess.emit();
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: errorMessage,
              confirmButtonText: 'OK'
            });
          } 
        }
      });
    } else {
      // Formulaire invalide - marquer les champs comme touchés pour afficher les validations
      this.form.markAllAsTouched();
    }
  }

  
  

    onSignupClick(): void {
      // Émettre l'événement pour dire au parent d'ouvrir le dialog d'inscription
      this.switchToSignup.emit();
    }

    
}
