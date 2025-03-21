import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VoitureComponent } from './voiture.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: VoitureComponent }
])],
  exports: [RouterModule]
})
export class VoitureRoutingModule { }
