import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideStore, MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appReducer } from './app/state/reducers';
import { MetaReducer as NgRxMetaReducer } from '@ngrx/store';
import { AuthGuard } from './app/guards/auth.guard';

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
          import('./app/features/dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'devices',
        loadChildren: () =>
          import('./app/features/devices/devices.module').then(m => m.DevicesModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'dosing',
        loadChildren: () =>
          import('./app/features/dosing/dosing.module').then(m => m.DosingModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'monitoring',
        loadChildren: () =>
          import('./app/features/monitoring/monitoring.module').then(m => m.MonitoringModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'plants',
        loadChildren: () =>
          import('./app/features/plants/plants.module').then(m => m.PlantModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'firmware-update',
        loadComponent: () =>
          import('./app/features/firmware/firmware-update.component').then(m => m.FirmwareUpdateComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./app/features/admin/admin-user-management.module').then(m => m.AdminUserManagementModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'farms',
        loadChildren: () =>
          import('./app/features/farms/farms.module').then(m => m.FarmsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'supply-chain',
        loadChildren: () =>
          import('./app/features/supply-chain/supply-chain.module').then(m => m.SupplyChainModule),
        canActivate: [AuthGuard]
      },
      // Login and signup remain public
      {
        path: 'login',
        loadComponent: () =>
          import('./app/features/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'signup',
        loadComponent: () =>
          import('./app/features/signup/signup.component').then(m => m.SignupComponent)
      },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    ]),
  ]
}).catch(err => console.error(err));
