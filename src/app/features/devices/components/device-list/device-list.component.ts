import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeviceDiscoveryComponent } from '../device-discovery/device-discovery.component';
import { DeviceService } from '../../../../services/device.service';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../state/state.model';
import { setDevices } from '../../../../state/actions';
import { Observable } from 'rxjs';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgFor,
    MatIconModule,
    MatButtonModule,
    MatTableModule
  ],
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent {
  devices$: Observable<any[]>;

  constructor(
    private dialog: MatDialog,
    private deviceService: DeviceService,
    private router: Router,
    private store: Store<{ app: AppState }>
  ) {
    this.devices$ = this.store.pipe(select(state => state.app.devices));
    this.fetchDevices();
  }

  fetchDevices(): void {
    this.deviceService.getDevices().subscribe({
      next: (data) => {
        this.store.dispatch(setDevices({ devices: data }));
      },
      error: (err) => console.error('Error fetching devices', err)
    });
  }

  openDiscoverDialog(): void {
    const dialogRef = this.dialog.open(DeviceDiscoveryComponent, {
      width: '600px',
      disableClose: true // Forces the user to use the UI inside the dialog to close it
    });

    dialogRef.afterClosed().subscribe(result => {
      // Refresh the device list if needed
      this.fetchDevices();
    });
  }

  viewDevice(id: number): void {
    this.router.navigate(['/devices', id]);
  }
}