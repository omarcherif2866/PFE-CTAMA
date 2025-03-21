import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageSinistreComponent } from './image-sinistre.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: ImageSinistreComponent }
])],
  exports: [RouterModule]
})
export class ImageSinistreRoutingModule { }
