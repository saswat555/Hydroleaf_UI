import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { FormsModule } from '@angular/forms';    
import { HttpClientModule } from '@angular/common/http';
import { PlantService, Plant } from '../../../../services/plant.service';
import { HttpClient } from '@angular/common/http';
import { setPlants } from '../../../../state/actions';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../state/state.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-plant-control',
  standalone: true,  
  imports: [CommonModule, FormsModule, HttpClientModule],  
  templateUrl: './plant-control.component.html',
  styleUrl: './plant-control.component.scss'
})
export class PlantControlComponent implements OnInit {
  plants$: Observable<Plant[]>; // ✅ Using Observable for NgRx state

  newPlant: Plant = {
    name: '',
    type: '',
    growth_stage: '',
    seeding_date: '',
    region: ''
  };
  isCreating: boolean = false;  
  isCreated: boolean = false;   
  isLoading: boolean = false;   
  llmResponse: any = null;      

  constructor(
    private plantService: PlantService, 
    private http: HttpClient,
    private store: Store<{ app: AppState }> 
  ) {
    this.plants$ = this.store.pipe(select(state => state.app.plants)); // ✅ Properly selecting plants state
  }

  ngOnInit(): void {
    this.fetchPlants();
  }

  fetchPlants(): void {
    this.plantService.getPlants().subscribe({
      next: (data) => this.store.dispatch(setPlants({ plants: data })), // ✅ Updating state via NgRx
      error: (error) => console.error('Error fetching plants:', error)
    });
  }

  createPlant(): void {
    this.isCreating = true;

    this.plantService.createPlant(this.newPlant).subscribe({
      next: () => {
        this.fetchPlants(); // ✅ Fetching updated data after creation
        this.isCreating = false;
        this.isCreated = true;
        this.resetForm();
        setTimeout(() => (this.isCreated = false), 3000);
      },
      error: (error) => {
        console.error('Error creating plant:', error);
        this.isCreating = false;
      }
    });
  }

  checkDosing(): void {
    if (!this.isCreated) return; 

    this.isLoading = true;  
    this.llmResponse = null; 

    const sensorData = { ph: 6.8, tds: 450 };  
    const plantProfile = {
      plant_name: this.newPlant.name,
      plant_type: this.newPlant.type,
      growth_stage: this.newPlant.growth_stage,
      seeding_date: this.newPlant.seeding_date,
      weather_locale: "Local"
    };

    this.http.post("http://localhost:8000/api/v1/dosing/llm-request", {
      sensor_data: sensorData,
      plant_profile: plantProfile
    }).subscribe(
      (response) => {
        this.llmResponse = response;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error calling LLM:', error);
        this.isLoading = false;
      }
    );
  }

  deletePlant(id: number): void {
    this.plantService.deletePlant(id).subscribe(() => {
      this.fetchPlants(); // ✅ Fetching updated data after deletion
    });
  }

  resetForm(): void {
    this.newPlant = {
      name: '',
      type: '',
      growth_stage: '',
      seeding_date: '',
      region: ''
    };
  }
}
