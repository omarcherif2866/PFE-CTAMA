import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, debounceTime, forkJoin } from 'rxjs';
import { LayoutService } from 'src/app/dashboard/layout/service/app.layout.service';
import { PrimeIcons } from "primeng/api";


@Component({
    templateUrl: './chartsdemo.component.html',
    styleUrl: './chartsdemo.component.scss'

})
export class ChartsDemoComponent {
gfg!: any[];
 
ngOnInit() {
  this.gfg = [
      {
          title: "1. Déclarer votre constat",
          Icon: "pi pi-file-edit",
          color: "#9C27B0",
          ButtonColor: "p-button-rounded p-button-secondary",
           link: "/constat"
      },
      {
          title: "2. Déposer votre constat",
          Icon: "pi pi-file-pdf",
          color: "#673AB7",
          ButtonColor: "p-button-rounded p-button-primary",
           link: "/documents"
      },
      {
          title: "3. Votre Expert Affecté",
          Icon: "fas fa-user-tie",
          color: "#FF9800",
          ButtonColor: "p-button-rounded p-button-success",
           link: "/documents"
      },
      {
          title: "4. Rendez-vous avec l'expert",
          Icon: "pi pi-fw pi-calendar-plus",
          color: "#607D8B",
          ButtonColor: "p-button-rounded p-button-danger",
           link: "/rendez-vous"
      },
      {
          title: "5. Déposer vos devis",
          Icon: "pi pi-file-pdf",
          color: "#99e2ff",
          ButtonColor: "p-button-rounded p-button-warning",
           link: "/devis_sinistres"
      },

  ];
}

// implements OnInit, OnDestroy 

//     isSmallScreen = window.innerWidth < 768;

//     pieChartData: any;
//     pieChartLabels: any;
//     pieChartOptions: any = {
//       responsive: true,
//     };

//     barChartData: any;
//     barChartOptions: any;

//     barChartDataYear: any;
//     barChartOptionsYear: any;
    
//     clientId: string = '';

//     doughnutData: any;

//     doughnutOptions: any;

//     lineData: any;

//     barData: any;

//     pieData: any;

//     polarData: any;

//     lineOptions: any;

//     barOptions: any;

//     pieOptions: any;

//     polarOptions: any;

//     radarOptions: any;

//     errorMessage: string | null = null;

//     productCount: number | null = null;

//     serviceCount: number | null = null;

//     clientCount: number | null = null;

//     partnerCount: number | null = null;

//     productsData!: any[];

//     clients: any[] = []; // Exemple de propriété

//     userRole: string | null = null;


//     subscription: Subscription;

//     projets: Projet[] = []; // Tous les projets récupérés
//     filteredProjets: Projet[] = []; // Projets filtrés

//     constructor(private layoutService: LayoutService, private orderService: OrderService,
//         private userService: UserService, private produitService: ProduitService
//         , private serviceService: ServiceService, private projetService: ProjetService
//     ) {
//         this.subscription = this.layoutService.configUpdate$
//             .pipe(debounceTime(25))
//             .subscribe((config) => {
//                 this.initCharts();
//             });
//     }

//     ngOnInit() {
//         this.clientId = localStorage.getItem('user_id') || ''; // Assurez-vous que l'ID du client est stocké dans localStorage
//         if (this.clientId) {
//           this.loadOrdersByStatus();
//         } else {
//           console.error('Client ID not found in localStorage');
//         }

//         this.userRole = localStorage.getItem('userRole');


//         // this.initCharts();
//         this.loadOrdersByStatus();
//         this.loadUserCounts();
//         this.loadProductCount();
//         this.loadServiceCount();
//         this.loadProductsByService();
//         this.getTopSellingProducts();
//         this.loadClientBudgets()
//         this.initializeCharts();
//         this.initializeClients();
//         this.fetchProjets();
//         this.updateBarChart();
//         this.updateBarChartByYear(); // Appel de la fonction pour récupérer les projets et générer le graphique

//     }


//     initializeCharts() {
//         // Initialisation des données et options pour les graphiques
//         this.lineData = { /* vos données pour le graphique en ligne */ };
//         this.lineOptions = { responsive: true, maintainAspectRatio: false };
//         this.pieData = { /* vos données pour le graphique en secteur */ };
//         this.pieOptions = { responsive: true, maintainAspectRatio: false };
//       }

//       initializeClients() {
//         // Initialisation des données et options pour les graphiques
//         this.lineData = { /* vos données pour le graphique en ligne */ };
//         this.lineOptions = { responsive: true, maintainAspectRatio: false };
//         this.pieData = { /* vos données pour le graphique en secteur */ };
//         this.pieOptions = { responsive: true, maintainAspectRatio: false };
//       }

//     initCharts() {
//         const documentStyle = getComputedStyle(document.documentElement);
//         const textColor = documentStyle.getPropertyValue('--text-color');
//         const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
//         const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        

      

//         this.pieData = {
//             labels: ['A', 'B', 'C'],
//             datasets: [
//                 {
//                     data: [540, 325, 702],
//                     backgroundColor: [
//                         documentStyle.getPropertyValue('--indigo-500'),
//                         documentStyle.getPropertyValue('--purple-500'),
//                         documentStyle.getPropertyValue('--teal-500')
//                     ],
//                     hoverBackgroundColor: [
//                         documentStyle.getPropertyValue('--indigo-400'),
//                         documentStyle.getPropertyValue('--purple-400'),
//                         documentStyle.getPropertyValue('--teal-400')
//                     ]
//                 }]
//         };

//         this.pieOptions = {
//             plugins: {
//                 legend: {
//                     labels: {
//                         usePointStyle: true,
//                         color: textColor
//                     }
//                 }
//             }
//         };


//         this.polarData = {
//             datasets: [{
//                 data: [
//                     11,
//                     16,
//                     7,
//                     3
//                 ],
//                 backgroundColor: [
//                     documentStyle.getPropertyValue('--indigo-500'),
//                     documentStyle.getPropertyValue('--purple-500'),
//                     documentStyle.getPropertyValue('--teal-500'),
//                     documentStyle.getPropertyValue('--orange-500')
//                 ],
//                 label: 'My dataset'
//             }],
//             labels: [
//                 'Indigo',
//                 'Purple',
//                 'Teal',
//                 'Orange'
//             ]
//         };

//         this.polarOptions = {
//             plugins: {
//                 legend: {
//                     labels: {
//                         color: textColor
//                     }
//                 }
//             },
//             scales: {
//                 r: {
//                     grid: {
//                         color: surfaceBorder
//                     }
//                 }
//             }
//         };

//     }

//     ngOnDestroy() {
//         if (this.subscription) {
//             this.subscription.unsubscribe();
//         }
//     }

//     loadOrdersByStatus() {
//       this.orderService.getOrdersByStatus(this.clientId)
//         .subscribe((data: any[]) => {
//           // Définir les couleurs en fonction des statuts
//           const statusColors: { [key: string]: string } = {
//             'En attente': '#FF6384',  // Couleur pour 'En attente'
//             'Confirmée': '#36A2EB',   // Couleur pour 'Confirmée'
//             'Expédiée': '#FFCE56',    // Couleur pour 'Expédiée'
//             'Livrée': '#E7E9ED',      // Couleur pour 'Livrée'
//             'Annulée': '#C9CBCF'      // Couleur pour 'Annulée'
//           };
  
//           // Initialisation des labels et des données pour le graphique
//           const labels: string[] = [];
//           const datasetData: number[] = [];
//           const backgroundColor: string[] = [];
  
//           // Transformation des données pour le graphique
//           data.forEach(order => {
//             // Pour chaque produit dans la commande, ajouter une entrée dans les labels
//             order.produits.forEach((produit: any) => {
//               labels.push(`${order.status}: ${produit.produit}`); // Affichage du statut avec le nom du produit
//               datasetData.push(order.total); // Total des produits pour chaque statut
  
//               // Ajouter la couleur correspondante à chaque statut
//               backgroundColor.push(statusColors[order.status] || '#FFFFFF'); // Utiliser une couleur par défaut si le statut n'est pas défini
//             });
//           });
  
//           this.doughnutData = {
//             labels: labels,
//             datasets: [{
//               data: datasetData,
//               backgroundColor: backgroundColor
//             }]
//           };
  
//           this.doughnutOptions = {
//             responsive: true,
//             cutout: '40%', // Modifiez ce pourcentage pour ajuster la taille du trou
//             plugins: {
//               legend: {
//                 position: 'top',
//                 labels: {
//                   boxWidth: 60, // Largeur de la case de couleur à gauche de chaque label
//                   boxHeight: 10, // Hauteur de la case de couleur
//                   boxPadding: 5, // Espace entre la case de couleur et le texte du label
//                   font: {
//                     size: 10, // Taille de la police des légendes
//                   }
//                 }
//               },
//               tooltip: {
//                 callbacks: {
//                   label: (context: any) => {
//                     let label = context.label || '';
//                     return label;
//                   }
//                 }
//               }
//             }
//           };

//         }, error => {
//           console.error('Error loading orders by status:', error);
//         });
//   }
  

//     loadUserCounts() {
//         this.userService.getUserCounts().subscribe(
//           data => {
//             this.pieData = {
//               labels: ['Clients', 'Partenaires'],
//               datasets: [
//                 {
//                   data: [data.clientCount, data.partnerCount],
//                   backgroundColor: ['#42A5F5', '#66BB6A'],
//                   hoverBackgroundColor: ['#64B5F6', '#81C784']
//                 }
//               ]
//             };
    
//             this.pieOptions = {
//               responsive: true,
//               maintainAspectRatio: false
//             };
//             this.clientCount = data.clientCount;
//             this.partnerCount = data.partnerCount;
//           },
//           error => {
//             console.error('Error fetching user counts:', error);
//             this.errorMessage = 'Error fetching user counts. Please try again later.';
//           }
//         );
//     }

//     loadProductCount() {
//         this.produitService.getProductCount().subscribe(
//           data => {
//             this.productCount = data.productCount;
//           },
//           error => {
//             console.error('Error fetching product count:', error);
//             this.errorMessage = 'Error fetching product count. Please try again later.';
//           }
//         );
//       }

//     loadServiceCount() {
//         this.serviceService.getServiceCount().subscribe(
//           data => {
//             this.serviceCount = data.serviceCount;
//           },
//           error => {
//             console.error('Error fetching service count:', error);
//             this.errorMessage = 'Error fetching service count. Please try again later.';
//           }
//         );
//       }
    
//     loadProductsByService(): void {
//         this.produitService.getProductsByService().subscribe((data: any[]) => {
//             // Formatage des données pour le Bar Chart
//             if (data && data.length > 0) {
//               this.productsData = data.map(item => ({
//                 service: item._id,
//                 count: item.products.length // Compte le nombre de produits pour chaque service
//               }));
          
//               // Préparation des données pour le Bar Chart
//               this.barData = {
//                 labels: this.productsData.map(item => item.service), // Les noms des services
//                 datasets: [
//                   {
//                     label: 'Nombre de Produits',
//                     backgroundColor: '#42A5F5',
//                     data: this.productsData.map(item => item.count), // Nombre de produits pour chaque service
//                   }
//                 ]
//               };
          
//               // Options du Bar Chart
//               this.barOptions = {
//                 responsive: true,
//                 legend: {
//                   position: 'top',
//                 },
//                 scales: {
//                   xAxes: [{
//                     ticks: {
//                       autoSkip: false
//                     }
//                   }],
//                   yAxes: [{
//                     ticks: {
//                       beginAtZero: true,
//                     }
//                   }]
//                 }
//               };
//             }
//           });
//       }
    
//     getTopSellingProducts() {
//         this.produitService.getTopSellingProducts().subscribe((data: any[]) => {

//             if (data && data.length > 0) {
//             // Préparer les données pour le Line Chart
//             this.lineData = {
//             labels: data.map(item => item.produitDetails.nom), 
//             datasets: [
//                 {
//                 label: 'Nombre de Commandes',
//                 borderColor: '#42A5F5',
//                 backgroundColor: 'rgba(66, 165, 245, 0.2)',
//                 data: data.map(item => item.count), // Nombre de commandes pour chaque produit
//                 fill: true,
//                 cubicInterpolationMode: 'monotone', // Rend la courbe lissée
//                 }
//             ]
//             };

//             this.lineOptions = {
//               responsive: true,
//               legend: {
//                 position: 'top',
//               },
//               scales: {
//                 x: {
//                   ticks: {
//                       display: false, // Désactiver l'affichage des labels sur l'axe x
//                       autoSkip: false
//                   },
//                   grid: {
//                       display: false // Désactiver l'affichage de la grille si souhaité
//                   }
//               },
//                 yAxes: [{
//                   ticks: {
//                     beginAtZero: true,
//                   }
//                 }]
//               }
//             };
//         }
//         });
//     }


//     loadClientBudgets() {
//         this.userService.getClientBudgets().subscribe(
//         (data: { name: string, budget: number }[]) => {
//             this.clients = data;
//         },
//         error => {
//             console.error('Error fetching client budgets:', error);
//         }
//         );
//     }



    
//     fetchProjets(): void {
//       this.projetService.getProjet().subscribe({
//         next: (projets) => {
  

//           const userIdsToFetch = [
//             ...new Set(
//               projets
//                 .map((projet) => [projet.ownedBy, projet.with]) 
//                 .flat() 
//                 .filter((id) => typeof id === 'string') 
//             ),
//           ];
  
  
//           if (userIdsToFetch.length > 0) {
//             const userRequests = userIdsToFetch.map((id) =>
//               this.userService.getUserProfile(id).toPromise()
//             );
  
//             Promise.all(userRequests)
//               .then((users) => {
  
//                 this.projets = projets.map((projet) => {
//                   const ownedByUser = users.find(
//                     (user: any) => user._id === projet.ownedBy
//                   );
//                   const withUser = users.find(
//                     (user: any) => user._id === projet.with
//                   );
  
//                   return {
//                     ...projet,
//                     ownedBy: ownedByUser ? ownedByUser : projet.ownedBy,
//                     with: withUser ? withUser : projet.with,
//                   };
//                 });
  
  
//                 this.filterByPartner();
//               })
//               .catch((err) => {
//               });
//           } else {
//             this.projets = projets;
//             this.filterByPartner();
//           }
//         },
//         error: (err) => {
//         },
//       });
//     }
  
//     filterByPartner(): void {
  
//       this.filteredProjets = this.projets.filter((projet) => {
//         const withIsPartner = projet.with?.userType === 'partner';
//         const ownedByIsPartner = projet.ownedBy?.userType === 'partner';
  
//         return withIsPartner || ownedByIsPartner;
//       });
  

//       this.updatePieChart();
//     }
  
//     updatePieChart(): void {
//       const statutCount: { [key: string]: number } = {};
    
//       this.filteredProjets.forEach((projet) => {
//         const statut = projet.status;
    
//         if (statut) {
//           if (!statutCount[statut]) {
//             statutCount[statut] = 0;
//           }
//           statutCount[statut]++;
//         }
//       });
    
//       const labels = Object.keys(statutCount); 
//       const data = Object.values(statutCount); 
    
//       this.pieChartData = {
//         labels: labels,
//         datasets: [
//           {
//             data: data,
//             backgroundColor: ['#66BB6A', '#FF7043','#Ff0000'], // Ajout de couleurs pour les statuts
//             hoverBackgroundColor: ['#81C784', '#FF8A65','#ff4d4d']
//           }
//         ]
//       };
    
//       this.pieChartOptions = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//           legend: {
//             position: 'top',
//           },
//         },
//       };
    
//     }
    

//     updateBarChart(): void {
//       const statutCount: { [key: string]: number[] } = {};  // Stocke les projets par année et mois
    
//       // Récupérer les projets via le service
//       this.projetService.getProjet().subscribe(projets => {
//         console.log("Tous les projets récupérés:", projets);  // Afficher tous les projets récupérés
    
//         // Filtrer les projets terminés
//         const completedProjets = projets.filter(projet => projet.status === 'Terminé');
//         console.log("Projets terminés:", completedProjets);
    
//         // Vérifier s'il y a des projets terminés
//         if (completedProjets.length === 0) {
//           console.log("Aucun projet terminé trouvé !");
//         }
    
//         // Initialiser le tableau de projets par année et mois
//         completedProjets.forEach((projet) => {
//           const updatedAt = new Date(projet['updatedAt']);  // Convertir la date en objet Date
//           console.log("Date du projet:", updatedAt);  // Afficher la date du projet
    
//           if (isNaN(updatedAt.getTime())) {
//             console.log("Date invalide:", projet['updatedAt']);
//             return;  // Si la date est invalide, on passe au projet suivant
//           }
    
//           const year = updatedAt.getFullYear();  // Année du projet
//           const month = updatedAt.getMonth();  // Mois du projet (indexé de 0 à 11)
    
//           // Initialiser le tableau pour l'année si nécessaire
//           if (!statutCount[year]) {
//             statutCount[year] = new Array(12).fill(0);  // Créer un tableau de 12 mois pour l'année (0-11)
//           }
    
//           // Incrémenter le mois correspondant
//           statutCount[year][month]++;  // Le mois est indexé de 0 à 11, pas de tableau imbriqué
//         });
    
//         // Récupérer les années triées
//         const labels = Object.keys(statutCount).sort();  // Trier les années
//         console.log("Labels des années:", labels);  // Afficher les années triées
    
//         // Formater les mois en français
//         const monthNames = [
//           'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
//           'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
//         ];
    
//         // Construire les labels pour chaque mois en français
//         const monthLabels = monthNames;
    
//         // Initialiser le tableau de données pour chaque mois avec 0
//         const transposedData = new Array(12).fill(0);  // Tableau de 12 mois, initialisé à 0
    
//         // Parcourir chaque année et ajouter les projets de chaque mois
//         labels.forEach(year => {
//           statutCount[year].forEach((count, month) => {
//             transposedData[month] += count;  // Additionner les projets pour chaque mois
//           });
//         });
    
//         // Afficher toutes les données, y compris les mois sans projet
//         this.barChartData = {
//           labels: monthLabels,  // Les mois en français seront affichés sur l'axe X
//           datasets: [
//             {
//               label: 'Projets terminés',
//               data: transposedData,  // Données pour chaque mois, total pour chaque année
//               backgroundColor: '#42A5F5',
//               hoverBackgroundColor: '#64B5F6',
//             }
//           ]
//         };
    
//         // Configuration des options du graphique
//         this.barChartOptions = {
//           responsive: true,
//           maintainAspectRatio: false,
//           scales: {
//             x: {
//               beginAtZero: true,
//               title: {
//                 display: true,
//                 text: 'Mois'  // L'axe X représente les mois en français
//               }
//             },
//             y: {
//               beginAtZero: true,
//               title: {
//                 display: true,
//                 text: 'Projets terminés'  // L'axe Y représente le nombre de projets terminés
//               },
//               ticks: {
//                 stepSize: 1,
//                 min: 0,
//               }
//             },
//           },
//           plugins: {
//             legend: {
//               position: 'top',
//             },
//           },  
//           elements: {
//             bar: {
//               borderWidth: 2,
//               barThickness: 30, // Augmentez cette valeur pour une hauteur de barre plus importante
//               maxBarThickness: 50, // Limite la taille maximale si responsive
//             },
//           },
//         };
    
//         console.log('Données du graphique à barres (Projets terminés par mois/année):', this.barChartData);
//       }, error => {
//         console.log("Erreur lors de la récupération des projets:", error);
//       });
//     }
    
    
    
    
//     // Fonction pour récupérer et compter les projets terminés par année
// getProjetsByAnnee(projets: any[]): { [key: number]: number } {
//   const statutCount: { [key: number]: number } = {};  // Stocke les projets par année

//   // Parcourir les projets et compter les projets par année
//   projets.forEach(projet => {
//     const updatedAt = new Date(projet['updatedAt']);  // Convertir la date en objet Date

//     if (isNaN(updatedAt.getTime())) {
//       return;  // Si la date est invalide, on passe au projet suivant
//     }

//     const year = updatedAt.getFullYear();  // Année du projet

//     // Initialiser le compteur pour l'année si nécessaire
//     if (!statutCount[year]) {
//       statutCount[year] = 0;
//     }

//     // Incrémenter le nombre de projets pour cette année
//     statutCount[year]++;
//   });

//   return statutCount;
// }

// // Fonction pour mettre à jour le graphique
// updateBarChartByYear(): void {
//   this.projetService.getProjet().subscribe(projets => {
//     console.log("Tous les projets récupérés:", projets);

//     const completedProjets = projets.filter(projet => projet.status === 'Terminé');
//     console.log("Projets terminés:", completedProjets);

//     if (completedProjets.length === 0) {
//       console.log("Aucun projet terminé trouvé !");
//     }

//     const statutCount = this.getProjetsByAnnee(completedProjets);
//     console.log("Projets par année:", statutCount);

//     const yearLabels = Object.keys(statutCount).sort((a, b) => parseInt(a) - parseInt(b));
//     console.log("Années triées:", yearLabels);

//     this.barChartDataYear = {
//       labels: yearLabels,
//       datasets: [
//         {
//           label: 'Projets terminés',
//           data: yearLabels.map(year => statutCount[parseInt(year)]),
//           backgroundColor: '#42A5F5',
//           hoverBackgroundColor: '#64B5F6',
//         }
//       ]
//     };

//     console.log('Données du graphique à barres:', this.barChartDataYear);
    
//     this.barChartOptionsYear = {
//       responsive: true,
//       maintainAspectRatio: false,
//       scales: {
//         x: {
//           beginAtZero: true,
//           title: {
//             display: true,
//             text: 'Année'
//           }
//         },
//         y: {
//           beginAtZero: true,
//           title: {
//             display: true,
//             text: 'Projets terminés'
//           },
//           ticks: {
//             stepSize: 1,
//             min: 0,
//           }
//         },
//       },
//       plugins: {
//         legend: {
//           position: 'top',
//         },
//       },
//       elements: {
//         bar: {
//           borderWidth: 2,
//           barThickness: 50, // Augmente la largeur des barres
//           maxBarThickness: 70, // Fixe une limite supérieure
//           minBarLength: 10, // Définit une longueur minimale des barres
//         },
//       },
      
//     };

//   }, error => {
//     console.log("Erreur lors de la récupération des projets:", error);
//   });
// }


    
    
    
  }
    

    
    

