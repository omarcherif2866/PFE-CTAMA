import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToutRisqueComponent } from './tout-risque.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: ToutRisqueComponent }
])],
  exports: [RouterModule]
})
export class ToutRisqueRoutingModule { }
