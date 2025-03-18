import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Farm {
  id?: number;
  name: string;
  location: string;
}

@Injectable({
  providedIn: 'root'
})
export class FarmService {
  private baseUrl = 'http://localhost:8000/api/v1/farms';

  constructor(private http: HttpClient) {}

  getFarms(): Observable<Farm[]> {
    return this.http.get<Farm[]>(this.baseUrl);
  }

  getFarmById(id: number): Observable<Farm> {
    return this.http.get<Farm>(`${this.baseUrl}/${id}`);
  }

  createFarm(farm: Farm): Observable<Farm> {
    return this.http.post<Farm>(this.baseUrl, farm);
  }

  deleteFarm(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
