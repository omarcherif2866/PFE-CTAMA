import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AuthService } from '../../services/auth/auth.service';
import { Actualite } from '../../models/actualite';
import { ActualiteService } from '../../services/actualite.service';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrl: './blog-details.component.scss'
})
export class BlogDetailsComponent {
  actualite: Actualite | undefined;
  isImageOnLeft: boolean = true; // Détermine si l'image est à gauche ou à droite

    staticPartners = [
      {
        nom: 'IBM',
        image: 'assets/img/partner-img/ibm.png',
        url: 'https://www.partner1.com'
      },
      {
        nom: 'Microsoft',
        image: 'assets/img/partner-img/microsoft.jpg',
        url: 'https://www.partner2.com'
      },
      {
        nom: 'Amazon Web actualites (AWS)',
        image: 'assets/img/partner-img/aws.jpg',
        url: 'https://www.partner3.com'
      },
      {
        nom: 'Oracle',
        image: 'assets/img/partner-img/oracle.png',
        url: 'https://www.partner3.com'
      },
      
    ];
  
    constructor(
      private route: ActivatedRoute,
      private actualiteService: ActualiteService,
      private userService: AuthService
    ) { }
  
    ngOnInit(): void {
      const actualiteId = this.route.snapshot.params['id'];
      this.getActualiteDetails(actualiteId);
  
    }

      partnerSlides: OwlOptions = {
        loop: true,
        nav: false,
        dots: false,
        autoplayHoverPause: true,
        autoplay: true,
        margin: 30,
        responsive: {
          0: {
            items: 2
          },
          576: {
            items: 4
          },
          768: {
            items: 4
          },
          992: {
            items: 6
          }
        }
        }

        getActualiteDetails(actualiteId: string): void {
          this.actualiteService.getActualiteById(actualiteId).subscribe(
            (data: any) => { 
              console.log('Détails actualité:', data); 
        
              this.actualite = new Actualite(
                data._id, 
                data.nom,
                data.description, 
                data.image 
              );

            },
            error => {
              console.error('Erreur lors du chargement des détails:', error);
            }
          );
        }

  getImageUrl(imageName?: string): string {
    if (imageName && !imageName.startsWith('assets/')) {
      // Si l'image provient de la base de données, on utilise une URL spécifique
      return `${imageName}`;
    }
    // Sinon, elle est dans les assets (statique)
    return imageName ? imageName : '';
  }


  
  

}
