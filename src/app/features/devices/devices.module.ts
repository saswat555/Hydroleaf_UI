import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeviceListComponent } from './components/device-list/device-list.component';
import { DeviceDetailComponent } from './components/device-detail/device-detail.component';

const routes: Routes = [
  { path: '', component: DeviceListComponent },
  { path: ':id', component: DeviceDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevicesModule { }
