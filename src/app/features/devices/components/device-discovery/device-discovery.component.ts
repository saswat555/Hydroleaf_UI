import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DeviceService } from '../../../../services/device.service';
import { DeviceConfigurationDialogComponent } from '../device-configuration-dialog/device-configuration-dialog.component';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-device-discovery',
  templateUrl: './device-discovery.component.html',
  styleUrls: ['./device-discovery.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatIconModule
  ]
})
export class DeviceDiscoveryComponent implements OnInit {
  discoveredDevice: any = null;
  // List of devices discovered via SSE that are not yet stored.
  discoveredDevices: any[] = [];
  // List of devices already stored in the DB.
  storedDevices: any[] = [];
  discoveredCount: number = 0;
  totalCount: number = 0;
  progressPercentage: number = 0;
  error: string | null = null;
  isChecking: boolean = false;
  ipToCheck: string = '';

  constructor(
    private deviceService: DeviceService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private zone: NgZone,  // Inject NgZone to run updates inside Angular's zone
    public authService: AuthService // Inject AuthService publicly so template can access it
  ) {}

  ngOnInit(): void {}

  checkDevice(): void {
    if (!this.ipToCheck.trim()) {
      this.snackBar.open('Please enter a valid IP address', 'Close', { duration: 3000 });
      return;
    }
    this.isChecking = true;
    this.error = null;
    this.discoveredDevice = null;
    this.deviceService.checkDevice(this.ipToCheck.trim()).subscribe({
      next: (response: any) => {
        // Run inside zone to trigger change detection.
        this.zone.run(() => {
          if (response && response.id) {
            this.discoveredDevice = response;
            this.snackBar.open('Device found!', 'Close', { duration: 3000 });
          } else {
            this.snackBar.open('No device found at that IP', 'Close', { duration: 3000 });
          }
        });
      },
      error: (err: any) => {
        this.zone.run(() => {
          this.error = 'Failed to check device';
          this.snackBar.open('Error checking device', 'Close', { duration: 3000 });
          console.error('Device check error:', err);
        });
      },
      complete: () => {
        this.zone.run(() => {
          this.isChecking = false;
        });
      }
    });
  }

  autoDiscoverAll(): void {
    this.isChecking = true;
    this.error = null;
    // Reset lists and counts.
    this.discoveredDevices = [];
    this.storedDevices = [];
    this.discoveredCount = 0;
    this.totalCount = 0;
    this.progressPercentage = 0;

    this.deviceService.discoverAllDevicesStream().subscribe({
      next: (data: any) => {
        // Wrap SSE event handling in zone.run to update UI dynamically.
        this.zone.run(() => {
          console.log('SSE event received:', data);
          if (data.eventCount !== undefined && data.total !== undefined) {
            this.discoveredCount = data.eventCount;
            this.totalCount = data.total;
            this.progressPercentage = parseFloat(
              ((this.discoveredCount / this.totalCount) * 100).toFixed(1)
            );
          }
          if (data.device) {
            // Add device if not already present.
            if (!this.discoveredDevices.find((d) => d.ip === data.device.ip)) {
              this.discoveredDevices.push(data.device);
            }
          }
          if (data.discovered_devices) {
            // Final event: update the discovered list.
            this.discoveredDevices = data.discovered_devices;
            this.progressPercentage = 100;
          }
        });
      },
      error: (err: any) => {
        this.zone.run(() => {
          console.error('Discovery error:', err);
          if (this.totalCount === 0) {
            this.error = 'Error during discovery';
            this.snackBar.open('Error during discovery', 'Close', { duration: 3000 });
          }
          this.isChecking = false;
        });
      },
      complete: () => {
        this.zone.run(() => {
          this.snackBar.open(`${this.discoveredDevices.length} devices discovered!`, 'Close', { duration: 3000 });
          this.isChecking = false;
          // Once discovery is complete, fetch stored devices from the DB.
          this.fetchStoredDevices();
        });
      }
    });
  }

  /**
   * Fetch devices that are already stored in the database.
   * Remove any that are already present from the discoveredDevices list.
   */
  fetchStoredDevices(): void {
    this.deviceService.getDevices().subscribe({
      next: (stored: any[]) => {
        this.storedDevices = stored || [];
        // Filter out devices from discoveredDevices that are already stored (match by IP).
        this.discoveredDevices = this.discoveredDevices.filter(
          dev => !this.storedDevices.find(storedDev => storedDev.ip === dev.ip)
        );
      },
      error: (err) => {
        console.error('Error fetching stored devices:', err);
        this.snackBar.open('Error fetching stored devices', 'Close', { duration: 3000 });
      }
    });
  }

  configureDevice(device: any): void {
    const dialogRef = this.dialog.open(DeviceConfigurationDialogComponent, {
      width: '600px',
      data: { device }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.zone.run(() => {
        if (result) {
          this.snackBar.open('Device configured successfully', 'Close', { duration: 3000 });
        }
      });
    });
  }
}
