import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConstatComponent } from './constat.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: ConstatComponent }
])],
  exports: [RouterModule]
})
export class ConstatRoutingModule { }
