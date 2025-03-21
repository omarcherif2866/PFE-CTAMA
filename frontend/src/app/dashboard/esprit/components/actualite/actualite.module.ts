import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActualiteComponent } from './actualite.component';
import { ActualiteRoutingModule } from './actualite-routing.module';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextareaModule } from 'primeng/inputtextarea';


@NgModule({
  declarations: [ActualiteComponent],
  imports: [
    CommonModule,
    TableModule,
    FileUploadModule,
    FormsModule,
    ButtonModule,
    ToastModule,
    ToolbarModule,
    InputTextModule,
    InputTextareaModule,
    DialogModule,
    ActualiteRoutingModule,
    ReactiveFormsModule,
    
  ],

  providers: [MessageService]  // Add MessageService here

})
export class ActualiteModule { }
