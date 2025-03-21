import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AuthService } from '../../services/auth/auth.service';
import { Clients } from '../../models/clients';

@Component({
    selector: 'app-about3',
    templateUrl: './about3.component.html',
    styleUrls: ['./about3.component.scss']
})
export class About3Component implements OnInit {



	
    Users: Clients[] = [];
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
		  nom: 'Amazon Web Services (AWS)',
		  image: 'assets/img/partner-img/aws.jpg',
		  url: 'https://www.partner3.com'
		},
		{
		  nom: 'Oracle',
		  image: 'assets/img/partner-img/oracle.png',
		  url: 'https://www.partner3.com'
		},
		
	  ];
	
	  allPartners: any[] = [];
    constructor( private userService: AuthService,
    ) { }

    ngOnInit(): void {

    }

    teamSlides: OwlOptions = {
		loop: true,
		nav: false,
		dots: true,
		autoplayHoverPause: true,
		autoplay: true,
		margin: 30,
		responsive: {
			0: {
				items: 1
			},
			576: {
				items: 2
			},
			768: {
				items: 2
			},
			992: {
				items: 3
			},
			1500: {
				items: 5
			}
		}
    }
    feedbackSlides: OwlOptions = {
		loop: true,
		nav: false,
		smartSpeed: 1000,
		autoplayTimeout: 5000,
		dots: true,
		animateOut: 'fadeOut',
		autoplayHoverPause: true,
		autoplay: true,
		items: 1
    }
    partnerSlides: OwlOptions = {
        loop: true,
        nav: false,
        dots: false,
        autoplay: true, // Active l'autoplay
        autoplayTimeout: 2000, // Temps entre les diapositives (en ms)
        autoplayHoverPause: true, // Pause l'autoplay lors du survol
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
      };

getImageUrl(imageName?: string): string {
  if (imageName && !imageName.startsWith('assets/')) {
    // Si l'image provient de la base de données, on utilise une URL spécifique
    return `https://srv667884.hstgr.cloud:9090/img/${imageName}`;
  }
  // Sinon, elle est dans les assets (statique)
  return imageName ? imageName : 'assets/img/default-image.png';
}




}