import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/components/services/auth/auth.service';
import Swal from 'sweetalert2';
import { Clients } from '../../models/clients';

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
  isSwapVisible: boolean = false; // Contrôle la visibilité du swap
  @Output() switchToSignup = new EventEmitter<void>();
  @Output() signInSuccess = new EventEmitter<void>(); // Nouvel événement




  constructor( private formBuilder: FormBuilder, private service: AuthService, private router: Router,
    private route: ActivatedRoute  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

  }



  signin() {
    if (this.form.valid) {
      const t = {
        email: this.form.value.email,
        password: this.form.value.password,
      };
  
      this.service.signIn(t).subscribe(
        (data) => {
          console.log('Sign-in response:', data);
          this.user = new Clients(
            data._id,
            data.email,
            "", 
            "",
            "", 
            "", 
            data.typeClient // Make sure your constructor maps this correctly
          );
  
          localStorage.setItem('user_id', this.user.Id);
          localStorage.setItem('user_email', this.user.Email);
          
          // Determine userRole based on flags
          let userRole;
          if (data.isEmployee && data.poste === 'admin') {
            userRole = 'admin';
          } else if (data.isExpert) {
            userRole = 'expert';
          } else {
            // Use data.typeClient directly instead of this.user.Type
            userRole = data.typeClient ;
          }
          
          localStorage.setItem('userRole', userRole);
          localStorage.setItem('loggedIn', 'true');
  
          this.service.setLoggedIn(true);
  
          // Émettre l'événement de succès
          this.signInSuccess.emit();
  
          Swal.fire({
            icon: 'success',
            title: 'Vous êtes connecté',
            showConfirmButton: false,
            timer: 1500
          });
  
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigateByUrl(returnUrl);
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: error,
          });
        }
      );
    }
  }

    onSignupClick(): void {
      // Émettre l'événement pour dire au parent d'ouvrir le dialog d'inscription
      this.switchToSignup.emit();
    }



}
