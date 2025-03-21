import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DevisSinistreComponent } from './devis-sinistre.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: DevisSinistreComponent }
])],
  exports: [RouterModule]
})
export class DevisSinistreRoutingModule { }
