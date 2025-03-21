import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
    selector: 'app-navbar-style-one',
    templateUrl: './navbar-style-one.component.html',
    styleUrls: ['./navbar-style-one.component.scss']
})
export class NavbarStyleOneComponent implements OnInit {
    isLoggedIn: boolean = false;
    displaySigninDialog: boolean = false;
    displaySignupDialog: boolean = false;

    constructor(private authService: AuthService,private router:Router
    ) { }

    ngOnInit(): void {
        this.authService.isLoggedIn().subscribe(status => {
            this.isLoggedIn = status;
          });
    }

    classApplied = false;
    toggleClass() {
        this.classApplied = !this.classApplied;
    }

    // Navbar Sticky
    isSticky: boolean = false;
    @HostListener('window:scroll', ['$event'])
    checkScroll() {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (scrollPosition >= 50) {
            this.isSticky = true;
        } else {
            this.isSticky = false;
        }
    }

    logout(): void {
        this.authService.logout();
    
        Swal.fire({
          icon: 'error',
          title: 'Vous êtes deconnecté',
          showConfirmButton: false,
          timer: 1500
        }); 
        

        this.router.navigate(['/']);
      }

      getUserId(): string | null {
        return localStorage.getItem('user_id');
      }

      openSigninDialog() {
        // Fermer le dialog d'inscription et ouvrir celui de connexion
        this.displaySignupDialog = false;
        this.displaySigninDialog = true;
      }

      onSignInSuccess() {
        this.displaySigninDialog = false; // Fermer le dialogue
      }
    
      openSignupDialog() {
        // Fermer le dialog de connexion et ouvrir celui d'inscription
        this.displaySigninDialog = false;
        this.displaySignupDialog = true;
      }

      onSignUpSuccess() {
        this.displaySignupDialog = false; // Fermer le dialogue
      }

  

}