import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SinistreRoutingModule } from './sinistre-routing.module';
import { TableModule } from 'primeng/table';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { MessagesModule } from 'primeng/messages';
import { SinistreComponent } from './sinistre.component';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';


@NgModule({
  declarations: [SinistreComponent],
  imports: [
    CommonModule,
    TableModule,
    RippleModule,
    ToolbarModule,
    InputTextModule, 
    SinistreRoutingModule,
    MessagesModule,
    FormsModule,  // Assurez-vous d'importer FormsModule
    DropdownModule,  // Assurez-vous que le module PrimeNG est également importé    MessagesModule,
    ToastModule,
    ButtonModule,
    DialogModule
  ],
    providers: [MessageService] 
})
export class SinistreModule { }
