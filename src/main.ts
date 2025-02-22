import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideRouter([
      {
        path: 'dashboard',
        loadChildren: () => import('./app/features/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'devices',
        loadChildren: () => import('./app/features/devices/devices.module')
          .then(m => m.DevicesModule)
      },
      {
        path: 'dosing',
        loadChildren: () => import('./app/features/dosing/dosing.module')
          .then(m => m.DosingModule)
      },
      {
        path: 'monitoring',
        loadChildren: () => import('./app/features/monitoring/monitoring.module')
          .then(m => m.MonitoringModule)
      },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
    ])
  ]
}).catch(err => console.error(err));