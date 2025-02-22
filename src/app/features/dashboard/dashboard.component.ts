import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule, NgIf, NgForOf, JsonPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

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
    MatCardModule,
    NgIf,
    NgForOf
  ]
})
export class DashboardComponent implements OnInit {
  devices: any[] = [];
  displayedColumns: string[] = ['id', 'name', 'mqtt_topic', 'pump_configurations', 'actions'];
  loading: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchDevices();
  }

  fetchDevices(): void {
    this.http.get<any[]>('http://localhost:8000/api/v1/devices').subscribe({
      next: (data) => {
        console.log('Devices fetched:', data);
        this.devices = data;
        this.loading = false;
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
