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
import { SafeHtmlPipe } from '../../../api/safe-html-pipe';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';

@NgModule({
	imports: [
		CommonModule,
		ChartsDemoRoutingModule,
		ChartModule,
		TableModule,
        FormsModule,
        ButtonModule,
        TimelineModule,
        CardModule,
		ToastModule,
		ProgressSpinnerModule,
		DialogModule
		],
	declarations: [ChartsDemoComponent,SafeHtmlPipe  ]
})
export class ChartsDemoModule { }
