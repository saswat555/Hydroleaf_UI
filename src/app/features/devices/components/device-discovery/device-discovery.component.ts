import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIcon } from '@angular/material/icon';
import { DeviceConfigurationDialogComponent } from '../device-configuration-dialog/device-configuration-dialog.component';
import { FormsModule } from '@angular/forms';


/**
 * Minimal DeviceService to check a device by IP.
 */
@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  constructor(private http: HttpClient) {}
  apiUrl = "http://localhost:5000";
  checkDevice(ip: string): Observable<any> {
  // Ensure the query parameter is correctly passed
  return this.http.get(`${this.apiUrl}/devices/discover`, { params: { ip } });
}
}

@Component({
  selector: 'app-device-discovery',
  templateUrl: './device-discovery.component.html',
  styleUrls: ['./device-discovery.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIcon
  ]
})
export class DeviceDiscoveryComponent implements OnInit {
  // Holds the discovered device (if any)
  discoveredDevice: any = null;
  // For showing error messages
  error: string | null = null;
  // Indicates if a check is in progress
  isChecking = false;
  // Bound to the input field for entering an IP address
  ipToCheck: string = '';

  constructor(
    private deviceService: DeviceService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Waiting for user input; no auto-check by default.
  }

  checkDevice(): void {
    if (!this.ipToCheck.trim()) {
      this.snackBar.open('Please enter a valid IP address', 'Close', { duration: 3000 });
      return;
    }
    this.isChecking = true;
    this.error = null;
    this.discoveredDevice = null;
    this.deviceService.checkDevice(this.ipToCheck.trim()).subscribe({
      next: (response) => {
        if (response && response.id) {
          this.discoveredDevice = response;
          this.snackBar.open('Device found!', 'Close', { duration: 3000 });
        } else {
          this.snackBar.open('No device found at that IP', 'Close', { duration: 3000 });
        }
      },
      
      error: (err) => {
        this.error = 'Failed to check device';
        this.snackBar.open('Error checking device', 'Close', { duration: 3000 });
        console.error('Device check error:', err);
      },
      complete: () => {
        this.isChecking = false;
      }
    });
  }

  configureDevice(device: any): void {
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
