import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AgenceService } from '../../services/agence.service';
import { AuthService } from '../../services/auth/auth.service';
import { Actualite } from '../../models/actualite';
import { ActualiteService } from '../../services/actualite.service';
import { ExpertService } from '../../services/expert.service';

@Component({
    selector: 'app-pc-repair-demo',
    templateUrl: './pc-repair-demo.component.html',
    styleUrls: ['./pc-repair-demo.component.scss']
})
export class PcRepairDemoComponent implements OnInit {
    actualites: Actualite[] = [];

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

    agencesCount: number = 0;
    expertsCount: number = 0;

    ppCount: number = 0;
    pmCount: number = 0;

    
    constructor(
          private agenceService: AgenceService,
          private UserService: AuthService,
          private cdr: ChangeDetectorRef,
          private actualiteService: ActualiteService,
          private expertService: ExpertService,

      
    ) { }

    ngOnInit(): void {
        this.getLastThreeActualites()
        this.coutAgence()
        this.coutClients()
        this.coutExperts()
    }


    

    




	agencyPortfolioMainBanner = [
        {
            bgImg: `assets/img/bannieres/siege.jpg`,
			subTitle: '',
            // `We are Agency`,
			title: 'Boostez Votre Croissance avec Nos Solutions IT Innovantes pour le Marché Africain',
            // `Bienvenue Chez OZISS COOPERATION`,
			desc: '',
            // `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.`,
        },
        {
            bgImg: `assets/img/bannieres/b1.jpg`,
},
        {
            bgImg: `assets/img/bannieres/b2.jpg`,
},
        {
            bgImg: `assets/img/bannieres/b3.jpg`,

        },
        {
          bgImg: `assets/img/bannieres/b5.jpg`,

      }
    ]

    homeSlides: any = {
      loop: true,
      autoplay: true,
      autoplayTimeout: 2000,
      autoplayHoverPause: true,
      nav: false,
      responsive: {
          0: {
              items: 1,
              nav: false
          },
          600: {
              items: 1,
              nav: false
          },
          1000: {
              items: 1,
              nav: false
          }
      }
  };
  
  
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
    
      feedbackSlides: OwlOptions = {
        loop: true,
        nav: false,
        dots: true,
        autoplayHoverPause: true,
        autoplay: true,
        margin: 30,
        items: 1
      };

    // Services Content
    singleRepairServices = [
        {
            bgImg: `assets/img/repair-services-img/1.jpg`,
            icon: `flaticon-monitor`,
            title: `Laptop Repair`,
            desc: `Lorem ipsum eiusmod dolor sit amet elit, adipiscing, sed do eiusmod tempor incididunt ut labore dolore magna aliqua.`,
            link: `services-details`
        },
        {
            bgImg: `assets/img/repair-services-img/2.jpg`,
            icon: `flaticon-idea`,
            title: `Computer Repair`,
            desc: `Lorem ipsum eiusmod dolor sit amet elit, adipiscing, sed do eiusmod tempor incididunt ut labore dolore magna aliqua.`,
            link: `services-details`
        },
        {
            bgImg: `assets/img/repair-services-img/3.jpg`,
            icon: `flaticon-layout`,
            title: `Apple Products Repair`,
            desc: `Lorem ipsum eiusmod dolor sit amet elit, adipiscing, sed do eiusmod tempor incididunt ut labore dolore magna aliqua.`,
            link: `services-details`
        },
        {
            bgImg: `assets/img/repair-services-img/4.jpg`,
            icon: `flaticon-update-arrows`,
            title: `Software Update`,
            desc: `Lorem ipsum eiusmod dolor sit amet elit, adipiscing, sed do eiusmod tempor incididunt ut labore dolore magna aliqua.`,
            link: `services-details`
        },
        {
            bgImg: `assets/img/repair-services-img/5.jpg`,
            icon: `flaticon-smartphone`,
            title: `Smartphone Repair`,
            desc: `Lorem ipsum eiusmod dolor sit amet elit, adipiscing, sed do eiusmod tempor incididunt ut labore dolore magna aliqua.`,
            link: `services-details`
        },
        {
            bgImg: `assets/img/repair-services-img/6.jpg`,
            icon: `flaticon-hard-disk`,
            title: `Data Backup & Recovery`,
            desc: `Lorem ipsum eiusmod dolor sit amet elit, adipiscing, sed do eiusmod tempor incididunt ut labore dolore magna aliqua.`,
            link: `services-details`
        }
    ]



getImageUrl(imageName?: string): string {
  if (imageName && !imageName.startsWith('assets/')) {
    // Si l'image provient de la base de données, on utilise une URL spécifique
    return `${imageName}`;
  }
  // Sinon, elle est dans les assets (statique)
  return imageName ? imageName : '';
}

      



  coutAgence() {
    this.agenceService.getAgencesCount().subscribe({
      next: (data) => {
        this.agencesCount = data.AgencesCount; // Ensure this matches the API response
        this.cdr.detectChanges(); // Manually trigger change detection

      },
      error: (err) => {
        console.error('Erreur lors de la récupération du nombre d\'agences:', err);
      }
    });
  }

  coutClients() {
    this.UserService.getClientsCount().subscribe({
      next: (data) => {
        this.ppCount = data.PPCount; // Ensure this matches the API response
        this.pmCount = data.PMCount; // Ensure this matches the API response
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du nombre de clients:', err);
      }
    });
  }

  coutExperts() {
    this.expertService.getExpertsCount().subscribe({
      next: (data) => {
        this.expertsCount = data.expertsCount; // Ensure this matches the API response
        this.cdr.detectChanges(); // Manually trigger change detection
        console.log(this.expertsCount)
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du nombre d\'experts:', err);
      }
    });
  }

  getLastThreeActualites(): void {
    this.actualiteService.getLastThreeActualites().subscribe(
      (data) => {
        this.actualites = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des actualités : ', error);
      }
    );
  }

  



  
}