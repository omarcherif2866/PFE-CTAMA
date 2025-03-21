import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AffectExpertToClientComponent } from './affect-expert-to-client.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: AffectExpertToClientComponent }
])],
  exports: [RouterModule]
})
export class AffectExpertToClientRoutingModule { }
