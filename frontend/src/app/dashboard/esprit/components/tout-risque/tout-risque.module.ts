import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToutRisqueRoutingModule } from './tout-risque-routing.module';
import { MessageService } from 'primeng/api';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToutRisqueComponent } from './tout-risque.component';


@NgModule({
  declarations: [ToutRisqueComponent],
  imports: [
    CommonModule,
    ToutRisqueRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PdfViewerModule

  ],
    providers: [MessageService]  // Add MessageService here
})
export class ToutRisqueModule { }
