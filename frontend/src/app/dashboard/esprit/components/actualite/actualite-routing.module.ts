import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActualiteComponent } from './actualite.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: ActualiteComponent }
])],
  exports: [RouterModule]
})
export class ActualiteRoutingModule { }
