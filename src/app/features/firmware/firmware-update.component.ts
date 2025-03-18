import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

const LAN_URL = 'http://localhost:8000/api/v1';
const CLOUD_URL = 'https://cloud.example.com/api/v1';

@Component({
  selector: 'app-firmware-update',
  templateUrl: './firmware-update.component.html',
  styleUrls: ['./firmware-update.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule]
})
export class FirmwareUpdateComponent {
  deviceId: number | null = null;
  firmwareFile: File | null = null;
  updateStatus: string = '';

  constructor(private http: HttpClient, private config: AppConfigService) {}

  // Use the connection mode from the config to determine the API URL
  get apiUrl(): string {
    return this.config.connectionMode === 'LAN' ? LAN_URL : CLOUD_URL;
  }

  onFileSelected(event: any) {
    this.firmwareFile = event.target.files[0];
  }

  updateFirmware() {
    if (!this.deviceId || !this.firmwareFile) {
      this.updateStatus = 'Please select a device and a firmware file.';
      return;
    }

    const formData = new FormData();
    formData.append('device_id', this.deviceId.toString());
    formData.append('firmware', this.firmwareFile);

    // Call the firmware update endpoint (ensure backend supports this endpoint)
    this.http.post(`${this.apiUrl}/devices/firmware-update`, formData)
      .subscribe({
        next: () => this.updateStatus = 'Firmware updated successfully!',
        error: () => this.updateStatus = 'Firmware update failed.'
      });
  }
}
