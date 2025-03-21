import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsDemoRoutingModule } from './chartsdemo-routing.module';
import { ChartModule } from 'primeng/chart'
import { ChartsDemoComponent } from './chartsdemo.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TimelineModule } from "primeng/timeline";

@NgModule({
	imports: [
		CommonModule,
		ChartsDemoRoutingModule,
		ChartModule,
		TableModule,
        FormsModule,
        ButtonModule,
        TimelineModule,
        CardModule
		],
	declarations: [ChartsDemoComponent]
})
export class ChartsDemoModule { }
