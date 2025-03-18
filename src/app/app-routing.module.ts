import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FirmwareUpdateComponent } from './features/firmware/firmware-update.component';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('../app/features/dashboard/dashboard.module')
      .then(m => m.DashboardModule)
  },
  {
    path: 'devices',
    loadChildren: () => import('./features/devices/devices.module')
      .then(m => m.DevicesModule)
  },
  {
    path: 'dosing',
    loadChildren: () => import('./features/dosing/dosing.module')
      .then(m => m.DosingModule)
  },
  {
    path: 'monitoring',
    loadChildren: () => import('./features/monitoring/monitoring.module')
      .then(m => m.MonitoringModule)
  },
  {
    path: 'plants',
    loadChildren: () => import('./features/plants/plants.module')
      .then(m => m.PlantModule)
  },
  {
    path: 'firmware-update',
    component: FirmwareUpdateComponent
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }