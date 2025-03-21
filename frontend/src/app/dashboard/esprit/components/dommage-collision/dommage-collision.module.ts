import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DommageCollisionRoutingModule } from './dommage-collision-routing.module';
import { MessageService } from 'primeng/api';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DommageCollisionComponent } from './dommage-collision.component';


@NgModule({
  declarations: [DommageCollisionComponent],
  imports: [
    CommonModule,
    DommageCollisionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PdfViewerModule

  ],
    providers: [MessageService]  // Add MessageService here
})
export class DommageCollisionModule { }
