import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Clients } from 'src/app/components/models/clients';
import { AuthService } from 'src/app/components/services/auth/auth.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent {
  Users: Clients[] = [];
  user!:Clients;
  cols: any[] = [];

  constructor(
    private userService: AuthService, private messageService: MessageService


  ) {}

  ngOnInit() {
    this.getAllClients()
  }

  getAllClients(): void {
    this.userService.getUser().subscribe(ss => {

      
      // Filtrer les utilisateurs pour ne garder que ceux avec userType = 'client'
      this.Users = ss;
      

    }, error => {
      // Gestion des erreurs
      console.error("Erreur lors de la récupération des utilisateurs:", error);
    });
  }

  getImageUrl(imageName: string): string {
    return `${imageName}`;
  }
  // getImageUrl(imageName: string): string {
  //   return `${imageName}`; 
  // }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  

}
