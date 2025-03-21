import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BriseGlaceRoutingModule } from './brise-glace-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MessageService } from 'primeng/api';
import { BriseGlaceComponent } from './brise-glace.component';


@NgModule({
  declarations: [BriseGlaceComponent],
  imports: [
    CommonModule,
    BriseGlaceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PdfViewerModule

  ],
    providers: [MessageService]  // Add MessageService here
})
export class BriseGlaceModule { }
