import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RapportExpertiseComponent } from './rapport-expertise.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: RapportExpertiseComponent }
])],
  exports: [RouterModule]
})
export class RapportExpertiseRoutingModule { }
