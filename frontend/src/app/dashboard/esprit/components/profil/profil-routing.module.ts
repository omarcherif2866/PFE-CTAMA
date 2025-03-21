import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfilComponent } from './profil.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: ProfilComponent }
])],
  exports: [RouterModule]
})
export class ProfilRoutingModule { }
