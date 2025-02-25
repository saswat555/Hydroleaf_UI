export class PlantModule { }
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlantControlComponent } from './components/plant-control/plant-control.component';

const routes: Routes = [
  { path: '', component: PlantControlComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlantRoutingModule {}