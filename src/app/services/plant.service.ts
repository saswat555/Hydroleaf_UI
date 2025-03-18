// src/app/services/plant.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Plant {
  id?: number;
  name: string;
  type: string;
  growth_stage: string;
  seeding_date: string;
  region: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlantService {
  // Ensure baseUrl points exactly to "/api/v1/plants"
  private baseUrl = 'http://localhost:8000/api/v1/plants';

  constructor(private http: HttpClient) {}

  // Update: remove the extra "/plants" from the URL.
  getPlants(): Observable<Plant[]> {
    return this.http.get<Plant[]>(`${this.baseUrl}`);
  }

  getPlantById(id: number): Observable<Plant> {
    return this.http.get<Plant>(`${this.baseUrl}/${id}`);
  }

  createPlant(plant: Plant): Observable<Plant> {
    return this.http.post<Plant>(`${this.baseUrl}`, plant);
  }

  deletePlant(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
