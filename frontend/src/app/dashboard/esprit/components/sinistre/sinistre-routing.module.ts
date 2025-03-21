import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SinistreComponent } from './sinistre.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: SinistreComponent }
])],
  exports: [RouterModule]
})
export class SinistreRoutingModule { }
