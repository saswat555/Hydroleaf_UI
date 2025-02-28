import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MonitoringDashboardComponent } from './components/monitoring-dashboard/monitoring-dashboard.component';
import { MonitoringRoutingModule } from './monitoring-routing.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    MonitoringDashboardComponent, 
    MonitoringRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ]
})
export class MonitoringModule { }



@NgModule({
  imports: [
    CommonModule,
    
  ]
})
export class DashboardModule {}
