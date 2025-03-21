import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgenceComponent } from './agence.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: AgenceComponent }
])],
  exports: [RouterModule]
})
export class AgenceRoutingModule { }
