import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionnaireComponent } from './gestionnaire.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: GestionnaireComponent }
])],
  exports: [RouterModule]
})
export class GestionnaireRoutingModule { }
