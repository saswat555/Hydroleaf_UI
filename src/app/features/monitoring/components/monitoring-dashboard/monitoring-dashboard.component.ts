// src/app/features/monitoring/components/monitoring-dashboard/monitoring-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-monitoring-dashboard',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './monitoring-dashboard.component.html',
  styleUrls: ['./monitoring-dashboard.component.scss']
})
export class MonitoringDashboardComponent implements OnInit {
  deviceId = 0;
  sensorData: any = null;
  isLoading = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  fetchSensorData() {
    if (!this.deviceId) {
      this.error = 'Please enter a valid Device ID';
      return;
    }
    this.isLoading = true;
    this.error = null;
    this.sensorData = null;

    this.http.get(`http://localhost:8000/api/v1/devices/sensoreading/${this.deviceId}`)
      .subscribe({
        next: (data) => {
          this.sensorData = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching sensor data:', err);
          this.error = 'Could not fetch sensor data';
          this.isLoading = false;
        }
      });
  }
}
