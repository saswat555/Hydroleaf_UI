import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HealthService {
  private baseUrl = 'http://localhost:8000/api/v1/health';

  constructor(private http: HttpClient) {}

  getHealth(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getDatabaseHealth(): Observable<any> {
    return this.http.get(`${this.baseUrl}/database`);
  }

  getFullHealth(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`);
  }
}
