import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  form!: FormGroup;

  constructor(private formBuilder: FormBuilder,private authService: AuthService,private router:Router) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onForgotPassword() {
    if (this.form.invalid) {
      return;
    }

    const email = this.form.value.email;

    this.authService.forget(email).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Email de réinitialisation de mot de passe envoyé avec succès',
          showConfirmButton: false,
          timer: 1500
        })
      },
      (error) => {
        console.error(error);
        if (error.status === 404) {
          Swal.fire({
            icon: 'error',
            title: 'Utilisateur non trouvé',
            showConfirmButton: false,
            timer: 1500
          })
        } else if (error.status === 500) {
        } else {
        }
      }
    );
  }
}