import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConstatRoutingModule } from './constat-routing.module';
import { MessageService } from 'primeng/api';
import { ConstatComponent } from './constat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [ConstatComponent],
  imports: [
    CommonModule,
    ConstatRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PdfViewerModule,
    DragDropModule

  ],
    providers: [MessageService]  // Add MessageService here
  
})
export class ConstatModule { }
