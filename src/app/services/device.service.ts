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

  // Choose the API URL based on the connection mode.
  private get apiUrl(): string {
    return this.config.connectionMode === 'LAN' ? LAN_URL : CLOUD_URL;
  }

  /**
   * Stream discovery progress via Server-Sent Events (SSE).
   * Returns an Observable that emits each SSE event (parsed as JSON).
   */
  discoverAllDevicesStream(): Observable<any> {
    return new Observable(observer => {
      const eventSource = new EventSource(`${this.apiUrl}/devices/discover-all`);

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          observer.next(data);
        } catch (error) {
          console.error('Error parsing SSE data', error);
          observer.error(error);
          eventSource.close();
        }
      };

      eventSource.onerror = (error) => {
        console.error('EventSource encountered an error', error);
        observer.error(error);
        eventSource.close();
      };

      // Cleanup on unsubscription.
      return () => {
        eventSource.close();
      };
    });
  }

  /**
   * Automatically discover all registered and reachable devices.
   * This method makes an HTTP GET request and returns an Observable of an array.
   */
  getAllDiscoveredDevices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/devices/discover-all`);
  }

  /**
   * Create a device.
   * For 'dosing_unit' devices, it uses the dosing endpoint;
   * for sensor devices, it uses the sensor endpoint.
   */
  createDevice(device: Device): Observable<Device> {
    const endpoint = device.type === 'dosing_unit'
      ? `${this.apiUrl}/devices/dosing`
      : `${this.apiUrl}/devices/sensor`;
    return this.http.post<Device>(endpoint, device);
  }

  /**
   * Get devices with an optional user filter.
   * If the user is an admin, they can optionally filter by user_id.
   * Otherwise, it uses the current user's id.
   */
  getDevices(userId?: number): Observable<Device[]> {
    const params: any = {};
    if (this.authService.isAdmin()) {
      if (userId) {
        params.user_id = userId.toString();
      }
    } else {
      const currentUserId = this.authService.getCurrentUserId();
      if (currentUserId) {
        params.user_id = currentUserId.toString();
      }
    }
    return this.http.get<Device[]>(`${this.apiUrl}/devices`, { params });
  }

  /**
   * Get device details for a specific device by its id.
   */
  getDeviceById(id: number): Observable<Device> {
    return this.http.get<Device>(`${this.apiUrl}/devices/${id}`);
  }

  /**
   * Register a device using the dosing endpoint.
   */
  registerDevice(deviceData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/devices/dosing`, deviceData);
  }

  /**
   * Check a device by its IP.
   */
  checkDevice(ip: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/discover`, { params: { ip } });
  }
}
