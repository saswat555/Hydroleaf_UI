import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgForOf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../state/state.model';
import { setDevices } from '../../state/actions';
import { Observable } from 'rxjs';
import { Device } from '../devices/device.interface';
import { DeviceService } from '../../services/device.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    NgIf,
    NgForOf
  ]
})
export class DashboardComponent implements OnInit {
  devices$: Observable<Device[]>;
  // Base columns for regular users; admin sees an extra "owner" column.
  displayedColumns: string[] = ['id', 'name', 'status', 'version', 'http_endpoint', 'actions'];
  loading = true;
  isAdmin = false;
  selectedUserId?: number;
  // For admin: list of users. (In a real app, fetch from backend.)
  users: { id: number; email: string }[] = [];

  constructor(
    private deviceService: DeviceService,
    private store: Store<{ app: AppState }>,
    private authService: AuthService
  ) {
    this.devices$ = this.store.pipe(select(state => state.app.devices));
    this.isAdmin = this.authService.isAdmin();
    if (this.isAdmin) {
      // Insert extra column "owner" after name
      this.displayedColumns.splice(2, 0, 'owner');
    }
  }

  ngOnInit(): void {
    if (this.isAdmin) {
      this.fetchUsers();
    }
    this.fetchDevices();
  }

  fetchDevices(): void {
    const userId = this.isAdmin ? this.selectedUserId : undefined;
    this.deviceService.getDevices(userId).subscribe({
      next: (data) => {
        this.store.dispatch(setDevices({ devices: data }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching devices', err);
        this.loading = false;
      }
    });
  }

  fetchUsers(): void {
    // Replace with a real API call to /admin/users if available.
    this.users = [
      { id: 1, email: 'user1@example.com' },
      { id: 2, email: 'user2@example.com' },
      { id: 3, email: 'admin@example.com' }
    ];
  }

  onUserChange(event: any): void {
    this.selectedUserId = event.target.value ? parseInt(event.target.value, 10) : undefined;
    this.fetchDevices();
  }

  autoDiscoverDevices(): void {
    this.deviceService.getAllDiscoveredDevices().subscribe({
      next: (devices) => {
        console.log('Auto-discovered devices:', devices);
        // Optionally update the store or show a modal with discovered devices.
      },
      error: (err) => console.error('Error auto discovering devices', err)
    });
  }

  viewDevice(id: number): void {
    console.log('View device with ID:', id);
    // Add navigation logic here (e.g., using Router.navigate)
  }
}
