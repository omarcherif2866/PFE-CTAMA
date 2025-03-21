import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentsComponent } from './documents.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: DocumentsComponent }
])],
  exports: [RouterModule]
})
export class DocumentsRoutingModule { }
