import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DosingControlComponent } from './dosing-control/dosing-control.component';
import { PlantService } from '../../services/plant.service'; 
import { DosingRoutingModule } from './dosing-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    DosingControlComponent,
    DosingRoutingModule
  ],
  providers: [PlantService], // ✅ Register the PlantService
  exports: [DosingControlComponent] 
})
export class DosingModule { }