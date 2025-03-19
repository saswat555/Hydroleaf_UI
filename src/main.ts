// src/main.ts

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideStore, MetaReducer  } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appReducer } from './app/state/reducers';
import { MetaReducer as NgRxMetaReducer } from '@ngrx/store';

export function localStorageSyncReducer(reducer: any) {
  return localStorageSync({ keys: ['app'], rehydrate: true })(reducer);
}

const metaReducers: NgRxMetaReducer<any>[] = [localStorageSyncReducer];

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideStore({ app: appReducer }, { metaReducers }),
    provideStoreDevtools({ maxAge: 25 }),
    provideRouter([
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./app/features/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'devices',
        loadChildren: () =>
          import('./app/features/devices/devices.module').then(m => m.DevicesModule)
      },
      {
        path: 'dosing',
        loadChildren: () =>
          import('./app/features/dosing/dosing.module').then(m => m.DosingModule)
      },
      {
        path: 'monitoring',
        loadChildren: () =>
          import('./app/features/monitoring/monitoring.module').then(m => m.MonitoringModule)
      },
      {
        path: 'plants',
        loadChildren: () =>
          import('./app/features/plants/plants.module').then(m => m.PlantModule)
      },
      {
        path: 'firmware-update',
        loadComponent: () =>
          import('./app/features/firmware/firmware-update.component').then(m => m.FirmwareUpdateComponent)
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./app/features/admin/admin-user-management.component').then(m => m.AdminUserManagementComponent)
      },
      {
        path: 'farms',
        loadChildren: () =>
          import('./app/features/farms/farms.module').then(m => m.FarmsModule)
      },
      {
        path: 'supply-chain',
        loadChildren: () =>
          import('./app/features/supply-chain/supply-chain.module').then(m => m.SupplyChainModule)
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./app/features/login/login.component').then(m => m.LoginComponent)
      },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      {
        path: 'signup',
        loadComponent: () => import('./app/features/signup/signup.component').then(m => m.SignupComponent)
      },
      
    ]),
    
  ]
}).catch(err => console.error(err));
