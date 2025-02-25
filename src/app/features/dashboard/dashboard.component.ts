import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule, NgIf, NgForOf, JsonPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { SharedStateService } from '../../services/shared-state.service';
import {MatIconModule} from '@angular/material/icon'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
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
  devices: any[] = [];
  displayedColumns: string[] = ['id', 'name', 'http_endpoint', 'pump_configurations', 'actions'];
  loading: boolean = true;

  constructor(private http: HttpClient, private sharedState: SharedStateService ) {}

  ngOnInit(): void {
    this.fetchDevices();
  }

  fetchDevices(): void {
    this.http.get<any[]>('http://localhost:8000/api/v1/devices').subscribe({
      next: (data) => {
        console.log('Devices fetched:', data);
        this.devices = data;
        this.loading = false;
        this.sharedState.setDevices(this.devices = data);
      },
      error: (err) => {
        console.error('Error fetching devices', err);
        this.devices = [];
        this.loading = false;
      }
    });
  }

  viewDevice(id: number): void {
    // Implement navigation or logic to view device details
    console.log('View device with ID:', id);
  }
}
