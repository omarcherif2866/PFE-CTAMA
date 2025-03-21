import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsRoutingModule } from './clients-routing.module';
import { MessageService } from 'primeng/api';
import { ClientsComponent } from './clients.component';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';


@NgModule({
  declarations: [ClientsComponent],
  imports: [
    CommonModule,
    TableModule,
    ToastModule,
    InputTextModule,
    ClientsRoutingModule
  ],

  providers: [MessageService]  // Add MessageService here

})
export class ClientsModule { }
