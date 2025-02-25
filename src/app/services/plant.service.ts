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
  private baseUrl = 'http://localhost:8000/api/v1/plants';  // Update this with your FastAPI URL

  constructor(private http: HttpClient) {}

  // ✅ GET: Fetch all plants
  getPlants(): Observable<Plant[]> {
    return this.http.get<Plant[]>(`${this.baseUrl}/plants`);
  }

  // ✅ GET: Fetch a single plant by ID
  getPlantById(id: number): Observable<Plant> {
    return this.http.get<Plant>(`${this.baseUrl}/plants/${id}`);
  }

  // ✅ POST: Create a new plant
  createPlant(plant: Plant): Observable<Plant> {
    return this.http.post<Plant>(`${this.baseUrl}/plants`, plant);
  }

  // ✅ DELETE: Remove a plant
  deletePlant(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/plants/${id}`);
  }
}
