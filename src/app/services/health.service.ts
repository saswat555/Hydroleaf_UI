import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class HealthService {
  private baseUrl = `${environment.apiUrl}/health`;


  constructor(private http: HttpClient) {}

  getHealth(): Observable<any> {
    return this.http.get(this.baseUrl);
  }
  
  getDatabaseHealth(): Observable<any> {
    return this.http.get(`${this.baseUrl}/database`);
  }
  
  getFullHealth(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`);
  }
}
