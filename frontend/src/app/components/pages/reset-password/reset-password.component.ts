import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',

  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  form!: FormGroup;
  userId!: string;
  verificationCode: string = '';
  isCodeVerified: boolean = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id'];

    this.form = this.formBuilder.group({
      password: ['', [Validators.required]],
    });
  }



  onResetPassword() {
    if (this.form.invalid) {
      return;
    }

    const { password } = this.form.value;



    this.authService.resetPassword(this.userId, password).subscribe(
      response => {
        Swal.fire({
          icon: 'success',
          title: 'Mot de passe mis à jour avec succès.',
          showConfirmButton: false,
          timer: 1500
        })
        this.router.navigate(['/signin']);
      },
      error => {
        console.error(error);
        if (error.status === 400) {
        } else {
        }
      }
    );
  }

  checkVerificationCode() {
    console.log("User ID:", this.userId);
    console.log("Code entré:", this.verificationCode);
  
    this.authService.verifyCode(this.userId, this.verificationCode).subscribe(
      (response) => {
         Swal.fire({
          title: 'Success!',
          text: 'Code vérifié avec succès.',
          icon: 'success',
          confirmButtonText: 'OK'
        });        
        console.log("Réponse du serveur:", response);
        this.isCodeVerified = true;
      },
      (error) => {
        console.error("Erreur de vérification du code:", error);
        alert("Code incorrect, veuillez réessayer.");
      }
    );
  }
  
  
}
