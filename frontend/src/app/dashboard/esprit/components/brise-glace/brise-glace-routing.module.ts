import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BriseGlaceComponent } from './brise-glace.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: BriseGlaceComponent }
])],
  exports: [RouterModule]
})
export class BriseGlaceRoutingModule { }
