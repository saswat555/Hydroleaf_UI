export class DosingModule { }
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DosingControlComponent } from './dosing-control/dosing-control.component';

const routes: Routes = [
  { path: '', component: DosingControlComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DosingRoutingModule {}