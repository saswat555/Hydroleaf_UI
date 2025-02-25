import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PlantControlComponent } from './components/plant-control/plant-control.component';
import { PlantService } from '../../services/plant.service'; 
import { PlantRoutingModule } from './plant-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    PlantControlComponent,
    PlantRoutingModule
  ],
  providers: [PlantService], // ✅ Register the PlantService
  exports: [PlantControlComponent] 
})
export class PlantModule { }