import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DommageCollisionComponent } from './dommage-collision.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: DommageCollisionComponent }
])],
  exports: [RouterModule]
})
export class DommageCollisionRoutingModule { }
