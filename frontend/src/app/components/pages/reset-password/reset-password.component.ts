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
}
