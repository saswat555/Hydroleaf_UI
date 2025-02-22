import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeviceDiscoveryComponent } from './components/device-discovery/device-discovery.component';
import { DeviceListComponent } from './components/device-list/device-list.component';
import { DeviceDetailComponent } from './components/device-detail/device-detail.component';

const routes: Routes = [
  { 
    path: '', 
    component: DeviceDiscoveryComponent 
  },
  { 
    path: 'list', 
    component: DeviceListComponent 
  },
  { 
    path: ':id', 
    component: DeviceDetailComponent 
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    DeviceDiscoveryComponent,
    DeviceListComponent,
    DeviceDetailComponent
  ]
})
export class DevicesModule { }