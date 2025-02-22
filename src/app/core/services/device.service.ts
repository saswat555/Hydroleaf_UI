import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Device } from '../../features/devices/device.interface';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private apiUrl = 'http://localhost:8000/api/v1';

  constructor(private http: HttpClient) {}

  discoverDevices(): Observable<any> {
    return this.http.get(`${this.apiUrl}/devices/discover`);
  }

  createDevice(device: Device): Observable<Device> {
    const endpoint = device.type === 'dosing_unit' 
      ? `${this.apiUrl}/devices/dosing`
      : `${this.apiUrl}/devices/sensor`;
    return this.http.post<Device>(endpoint, device);
  }

  getDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(`${this.apiUrl}/devices`);
  }

  getDeviceById(id: number): Observable<Device> {
    return this.http.get<Device>(`${this.apiUrl}/devices/${id}`);
  }
}