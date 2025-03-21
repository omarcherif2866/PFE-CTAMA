import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'charts', data: { breadcrumb: 'Charts' }, loadChildren: () => import('./charts/chartsdemo.module').then(m => m.ChartsDemoModule) },

        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class UIkitRoutingModule { }
