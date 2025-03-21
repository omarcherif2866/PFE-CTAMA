import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpertComponent } from './expert.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: ExpertComponent }
])],
  exports: [RouterModule]
})
export class ExpertRoutingModule { }
