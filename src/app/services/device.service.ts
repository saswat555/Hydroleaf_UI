import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Device } from '../features/devices/device.interface';
import { AppConfigService } from '../app-config.service';
import { AuthService } from './auth.service';

const LAN_URL = 'http://localhost:8000/api/v1';
const CLOUD_URL = 'https://cloud.example.com/api/v1';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  constructor(
    private http: HttpClient,
    private config: AppConfigService,
    private authService: AuthService
  ) {}

  private get apiUrl(): string {
    return this.config.connectionMode === 'LAN' ? LAN_URL : CLOUD_URL;
  }

  discoverDevices(): Observable<any> {
    return this.http.get(`${this.apiUrl}/devices/discover`);
  }

  // New: Automatically discover all registered and reachable devices
  getAllDiscoveredDevices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/devices/discover-all`);
  }

  createDevice(device: Device): Observable<Device> {
    // For dosing_unit devices use the dosing endpoint, for sensors use sensor endpoint.
    const endpoint = device.type === 'dosing_unit'
      ? `${this.apiUrl}/devices/dosing`
      : `${this.apiUrl}/devices/sensor`;
    return this.http.post<Device>(endpoint, device);
  }

  // Updated: Accept optional user filter (for admin view)
  getDevices(userId?: number): Observable<Device[]> {
    const params: any = {};
    if (this.authService.isAdmin()) {
      if (userId) {
        params.user_id = userId.toString();
      }
      // Admin: get all devices or filter by user
      return this.http.get<Device[]>(`${this.apiUrl}/devices`, { params });
    } else {
      // Regular user: filter by current user's id
      const currentUserId = this.authService.getCurrentUserId();
      if (currentUserId) {
        params.user_id = currentUserId.toString();
      }
      return this.http.get<Device[]>(`${this.apiUrl}/devices`, { params });
    }
  }

  getDeviceById(id: number): Observable<Device> {
    return this.http.get<Device>(`${this.apiUrl}/devices/${id}`);
  }

  registerDevice(deviceData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/devices/dosing`, deviceData);
  }
}
