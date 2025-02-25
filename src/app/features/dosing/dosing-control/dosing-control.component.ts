import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { PlantService, Plant } from '../../../services/plant.service';
import { SharedStateService } from '../../../services/shared-state.service';

@Component({
  selector: 'app-dosing-control',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dosing-control.component.html',
  styleUrls: ['./dosing-control.component.scss'] // ✅ Fixed typo
})
export class DosingControlComponent implements OnInit {
  plants$: Observable<Plant[]>;
  devices$: Observable<any[]>;
  selectedPlant: Plant | null = null;
  selectedDevice: any | null = null;
  llmResponse: any | null = null;
  isLoading: boolean = false;

  constructor(
    private http: HttpClient,
    private sharedState: SharedStateService,
    private plantService: PlantService
  ) {
    this.plants$ = this.sharedState.plants$;
    this.devices$ = this.sharedState.devices$;
  }

  ngOnInit(): void {}
  isValidJson(data: any): boolean {
    if (typeof data !== "string") return true;
    try {
      JSON.parse(data);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  checkDosing(): void {
    if (!this.selectedPlant || !this.selectedDevice) return;
  
    this.isLoading = true;
    this.llmResponse = null;
  
    const requestData = {
      sensor_data: { 
        ph: 6.8, // Example values; adjust as necessary
        tds: 450 
      }, 
      plant_profile: {
        plant_name: this.selectedPlant.name,
        plant_type: this.selectedPlant.type,
        growth_stage: this.selectedPlant.growth_stage,
        seeding_date: this.selectedPlant.seeding_date, // ✅ Ensure date is passed
        weather_locale: this.selectedPlant.region ?? "Unknown" // ✅ Correctly mapped
      }
    };
  
    this.http.post(`http://localhost:8000/api/v1/dosing/llm-request?device_id=${this.selectedDevice.id}`, requestData)
      .pipe(
        tap(response => {
          console.log("LLM Response:", response); // ✅ Print response to console
          this.llmResponse = response;
          this.isLoading = false;
        })
      )
      .subscribe({
        error: (err) => {
          console.error("Error in LLM request:", err);
          this.isLoading = false;
        }
      });
  }

  copyToClipboard(data: any) {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  }
  
}
