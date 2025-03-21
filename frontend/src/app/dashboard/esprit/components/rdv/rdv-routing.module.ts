import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RdvComponent } from './rdv.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: RdvComponent }
])],
  exports: [RouterModule]
})
export class RdvRoutingModule { }
