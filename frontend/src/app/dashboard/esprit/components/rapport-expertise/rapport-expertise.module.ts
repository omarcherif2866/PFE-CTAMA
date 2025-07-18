import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { MessagesModule } from 'primeng/messages';
import { RapportExpertiseRoutingModule } from './rapport-expertise-routing.module';
import { RapportExpertiseComponent } from './rapport-expertise.component';
import { StepsModule } from 'primeng/steps';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CheckboxModule } from 'primeng/checkbox';


@NgModule({
  declarations: [RapportExpertiseComponent],
  imports: [
   CommonModule,
    TableModule,
    FileUploadModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    InputTextareaModule,
    DialogModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    MessagesModule,
    StepsModule,
    AutoCompleteModule,
    CheckboxModule,
    RapportExpertiseRoutingModule
  ],    providers: [MessageService]  // Add MessageService here
  
})
export class RapportExpertiseModule { }
