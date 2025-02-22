import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeviceService } from '../../../../core/services/device.service';
import { DeviceConfigurationDialogComponent } from '../device-configuration-dialog/device-configuration-dialog.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-device-discovery',
  templateUrl: './device-discovery.component.html',
  styleUrls: ['./device-discovery.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIcon
  ]
})
export class DeviceDiscoveryComponent implements OnInit {
  discoveredDevices: any[] = [];
  isScanning = false;
  error: string | null = null;

  constructor(
    private deviceService: DeviceService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.scanForDevices();
  }

  scanForDevices() {
    this.isScanning = true;
    this.error = null;

    this.deviceService.discoverDevices().subscribe({
      next: (response) => {
        this.discoveredDevices = response.devices;
        if (this.discoveredDevices.length === 0) {
          this.snackBar.open('No devices found', 'Close', { duration: 3000 });
        }
      },
      error: (err) => {
        this.error = 'Failed to discover devices';
        this.snackBar.open('Error scanning for devices', 'Close', { duration: 3000 });
        console.error('Device discovery error:', err);
      },
      complete: () => {
        this.isScanning = false;
      }
    });
  }

  configureDevice(device: any) {
    const dialogRef = this.dialog.open(DeviceConfigurationDialogComponent, {
      width: '600px',
      data: { device }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Device configured successfully', 'Close', { duration: 3000 });
      }
    });
  }
}