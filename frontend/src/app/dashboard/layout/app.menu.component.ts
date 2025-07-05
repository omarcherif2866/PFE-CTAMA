import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        const userRole = localStorage.getItem('userRole');

        this.model = [

            {
                label: 'Tableau de bord',
                items: [
                    { label: 'Tableau de bord', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/dashboard'] },                ]
            },









        ];

        if (userRole === 'admin' || userRole === 'gestionnaire_sinistre') {
            this.model.splice(5, 0,{
                label: 'Actualites',
                items: [
                    { label: 'Actualites', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/actualite'] }]
                },);

            this.model.splice(2, 0,{
                label: 'Agences',
                items: [
                    { label: 'Agences', icon: 'flaticon-skyline', routerLink: ['/agences'] }]
                },);
            
            this.model.splice(5, 0,{
                label: 'Expert',
                items: [
                    { label: 'Ajouter Expert', icon: 'fas fa-user-tie', routerLink: ['/addExpert'] },
                    { label: 'Affecter Expert à un Client', icon: 'fas fa-user-tie', routerLink: ['/affectExpertToClient'] }

                ]
            },);
            this.model.splice(5, 0,{
                label: 'Emplyees',
                items: [
                    { label: 'Ajouter Employé', icon: 'fas fa-user-tie', routerLink: ['/addEmplyee'] },

                ]
            },);

            this.model.splice(2, 0,{
                label: 'Constats',
                items: [
                    { label: 'Constat', icon: 'pi pi-file-pdf', routerLink: ['/documents'] },
                    { label: 'Images sinistre', icon: 'pi pi-file-pdf', routerLink: ['/image_sinistres'] },
                    { label: 'Devis sinistre', icon: 'pi pi-file-pdf', routerLink: ['/devis_sinistres'] }
                
                ]
                });
                const userId = localStorage.getItem('user_id');
                this.model.splice(5, 0, {
                  label: 'Expertise',
                  items: [
                    { label: 'Rapports d\'expertise', icon: 'pi pi-file-pdf', routerLink: [`/expertise`, userId] }
                  ]
                });
                this.model.splice(2, 0,{
                label: 'Sinistres',
                items: [
                    { label: 'Sinistres', icon: 'fas fa-skull-crossbones', routerLink: ['/sinistres'] },
]
    
                },);
        } else if (userRole === 'expert'){
            this.model.splice(2, 0,{
                label: 'Dépôt des documents',
                items: [
                    { label: 'Constat', icon: 'pi pi-file-pdf', routerLink: ['/documents'] },
                    { label: 'Images sinistre', icon: 'pi pi-file-pdf', routerLink: ['/image_sinistres'] },
                    { label: 'Devis sinistre', icon: 'pi pi-file-pdf', routerLink: ['/devis_sinistres'] }
                
                ]
                });
                this.model.splice(5, 0,{
                    label: 'Emplyees',
                    items: [
                        { label: 'Ajouter Emplyees', icon: 'fas fa-user-tie', routerLink: ['/addEmplyee'] },
    
                    ]
                },);
            this.model.splice(2, 0,{
                label: 'Sinistres',
                items: [
                    { label: 'Sinistres', icon: 'fas fa-skull-crossbones', routerLink: ['/sinistres'] },
                    { label: 'Sinistres', icon: 'fas fa-bolt', routerLink: ['/sinistres'] }]
    
                },);

                this.model.splice(2, 0, {
                    label: 'Rendez-vous',
                    items: [
                        { label: 'Rendez-vous', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/rendez-vous'] }
                    ]
                });
                const expertId = localStorage.getItem('user_id');
                this.model.splice(5, 0, {
                  label: 'Expertise',
                  items: [
                    { label: 'Rapports d\'expertise', icon: 'pi pi-file-pdf', routerLink: [`/expertise`, expertId] }
                  ]
                });
                
        } else if (userRole === 'PersonnePhysique') {
            this.model.splice(2, 0,{
                label: 'Déclaration de Sinistres',
                items: [
                    { label: 'Constats (La Responsabilité civile)', icon: 'pi pi-file-edit', routerLink: ['/constat'] },
                    { label: 'Constats (le bris de glace)', icon: 'pi pi-file-edit', routerLink: ['/brise-glaces'] },                
                    { label: 'Constats (Dommage et Collision)', icon: 'pi pi-file-edit', routerLink: ['/dommage-collision'] },                
                    { label: 'Constats (L’assurance tout risque ou Tiérce)', icon: 'pi pi-file-edit', routerLink: ['/tout-risque'] },                
                
                ]
            },);

            this.model.splice(2, 0,{
                label: 'Voitures',
                items: [
                    { label: 'Voitures', icon: 'pi pi-car', routerLink: ['/voiture'] },                ]
            });
            this.model.splice(2, 0,{
            label: 'Dépôt des documents',
            items: [
                { label: 'Constat', icon: 'pi pi-file-pdf', routerLink: ['/documents'] },
                { label: 'Images sinistre', icon: 'pi pi-file-pdf', routerLink: ['/image_sinistres'] },
                { label: 'Devis sinistre', icon: 'pi pi-file-pdf', routerLink: ['/devis_sinistres'] }
            
            ]
            });
            this.model.splice(2, 0, {
                label: 'Rendez-vous',
                items: [
                    { label: 'Rendez-vous', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/rendez-vous'] }
                ]
            });
        } else if (userRole === 'PersonneMorale') {
            this.model.splice(2, 0,{
                label: 'Déclaration de Sinistres',
                items: [
                    { label: 'Constats (La Responsabilité civile)', icon: 'pi pi-file-edit', routerLink: ['/constat'] },
                    { label: 'Constats (le bris de glace)', icon: 'pi pi-file-edit', routerLink: ['/brise-glaces'] },                
                    { label: 'Constats (Dommage et Collision)', icon: 'pi pi-file-edit', routerLink: ['/dommage-collision'] },                
                    { label: 'Constats (L’assurance tout risque ou Tiérce)', icon: 'pi pi-file-edit', routerLink: ['/tout-risque'] },                
                
                ]
            },);

            this.model.splice(2, 0,{
                label: 'Voitures',
                items: [
                    { label: 'Voitures', icon: 'pi pi-car', routerLink: ['/voiture'] },                ]
            });
            this.model.splice(2, 0,{
                label: 'Dépôt des documents',
                items: [
                    { label: 'Constat', icon: 'pi pi-file-pdf', routerLink: ['/documents'] },
                    { label: 'Images sinistre', icon: 'pi pi-file-pdf', routerLink: ['/image_sinistres'] },
                    { label: 'Devis sinistre', icon: 'pi pi-file-pdf', routerLink: ['/devis_sinistres'] }
                
                ]
                });
                this.model.splice(2, 0, {
                    label: 'Rendez-vous',
                    items: [
                        { label: 'Rendez-vous', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/rendez-vous'] }
                    ]
                });
        } if (userRole === 'gestionnaire_sinistre') {

            this.model.splice(5, 0,{
                label: 'Expert',
                items: [
                    { label: 'Ajouter Expert', icon: 'fas fa-user-tie', routerLink: ['/addExpert'] },
                    { label: 'Affecter Expert à un Client', icon: 'fas fa-user-tie', routerLink: ['/affectExpertToClient'] }

                ]
            },);

            this.model.splice(2, 0,{
                label: 'Constats',
                items: [
                    { label: 'Constat', icon: 'pi pi-file-pdf', routerLink: ['/documents'] },
                
                ]
                });

        } 
        
    }
}
