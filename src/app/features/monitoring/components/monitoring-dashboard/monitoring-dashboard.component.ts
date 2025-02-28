import { Component, OnInit, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../state/state.model';
import { setDevices, setPhTdsDevice } from '../../../../state/actions';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Plant } from '../../../../services/plant.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-monitoring-dashboard',
  templateUrl: './monitoring-dashboard.component.html',
  styleUrl: './monitoring-dashboard.component.scss',
  imports: [CommonModule, NgForOf, NgIf, MatIconModule, MatProgressSpinnerModule, FormsModule ],
})
export class MonitoringDashboardComponent implements OnInit {
  plants$: Observable<Plant[]>; 
  devices$: Observable<any[]>;  
  displayedColumns: string[] = ['id', 'name', 'http_endpoint', 'actions'];
  loading: boolean = true;
  planLoading: boolean = false;  // separate loading state for plan request
  showPlanModal: boolean = false;  
  selectedDevice: any | null = null;
  selectedPlant: Plant | null = null;
  userQuery: string = "";  
  planResponse: string = ""; 

  deviceReadings$: Observable<{ [key: number]: { pH: number; TDS: number } }>;
  viewingDevices: { [key: number]: boolean } = {};  

  constructor(
    private http: HttpClient,
    private store: Store<{ app: AppState }>,
    private ngZone: NgZone
  ) {
    this.devices$ = this.store.pipe(select(state => state.app.devices));
    this.deviceReadings$ = this.store.pipe(select(state => state.app.phTdsReadings));
    this.plants$ = this.store.pipe(select(state => state.app.plants)); 
  }

  ngOnInit(): void {
    this.fetchDevices();
  }

  fetchDevices(): void {
    this.http.get<any[]>('http://localhost:8000/api/v1/devices').subscribe({
      next: (data) => {
        // Filter only devices whose name starts with "ph_tds"
        const filteredDevices = data.filter(device => device.name.startsWith('ph_tds'));
        this.store.dispatch(setDevices({ devices: filteredDevices })); // Save to store
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching devices', err);
        this.loading = false;
      }
    });
  }

  viewDevice(id: number): void {
    this.viewingDevices[id] = true; // Show loading state for selected device
    const url = `http://localhost:8000/api/v1/devices/sensoreading/${id}`;
    this.http.get<any>(url).subscribe({
      next: (response) => {
        const pH = response?.pH || 'N/A';
        const TDS = response?.TDS || 'N/A';
        this.store.dispatch(setPhTdsDevice({ devices: { [id]: { pH, TDS } } }));
        this.viewingDevices[id] = false;
      },
      error: (err) => {
        console.error('Error fetching sensor reading:', err);
        this.viewingDevices[id] = false;
      }
    });
  }

  openPlanModal() {
    this.showPlanModal = true;
  }
  
  parseGrowingPlan(responseText: string): string {
    // Remove unwanted markers and formatting
    responseText = responseText.replace(/<\/?think>/g, '');  // Remove <think> tags
    responseText = responseText.replace(/\*\*/g, '');        // Remove bold markers (**)
    responseText = responseText.replace(/##+/g, '');         // Remove markdown headers (##, ###, ####)
  
    // Split the response into sections based on common delimiters
    let sections = responseText.split(/\n---\n|\n\n/).map(section => section.trim());
  
    let parsedOutput = '';
  
    sections.forEach(section => {
      // Handle bullet points and numbered lists
      if (section.startsWith('- ') || section.startsWith('1.') || section.startsWith('2.')) {
        parsedOutput += `<ul>${section.replace(/\n- /g, '</li><li>').replace(/^- /, '<li>')}</li></ul>\n`;
      } else if (section.match(/^\d+\./)) {
        parsedOutput += `<ol>${section.replace(/\n\d+\./g, '</li><li>').replace(/^\d+\./, '<li>')}</li></ol>\n`;
      } else {
        parsedOutput += `<p>${section}</p>\n`;
      }
    });
  
    return parsedOutput;
  }
  
  
  checkPlan() {
    if (!this.selectedDevice || !this.selectedPlant || !this.userQuery.trim()) {
      console.error("Please select a device, a plant, and enter a query.");
      return;
    }
    
    // Use take(1) to get the current sensor reading only once.
    this.deviceReadings$.pipe(take(1)).subscribe((readings) => {
      const latestReading = readings[this.selectedDevice?.id] || { pH: "N/A", TDS: "N/A" };

      const requestData = {
        sensor_data: {
          pH: latestReading.pH, 
          TDS: latestReading.TDS
        },
        plant_profile: {
          plant_name: this.selectedPlant?.name ?? "Unknown",
          plant_type: this.selectedPlant?.type ?? "Unknown",
          growth_stage: this.selectedPlant?.growth_stage ?? "Unknown",
          seeding_date: this.selectedPlant?.seeding_date ?? "Unknown",
          region: this.selectedPlant?.region ?? "Unknown",
          location: this.selectedPlant?.location ?? "N/A"
        },
        query: this.userQuery
      };

      const url = `http://localhost:8000/api/v1/dosing/llm-plan?device_id=${this.selectedDevice.id}`;
      console.log(url)
      // Set planLoading to true and clear previous response
      this.planLoading = true;
      this.planResponse = "";

      // Use fetch to send the request and process a streaming response.
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      }).then(response => {
        if (!response.body) {
          throw new Error("ReadableStream not yet supported in this browser.");
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        const processStream: any = async () => {
          const { done, value } = await reader.read();
          if (done) {
            // Finalize when stream is complete.
            this.ngZone.run(() => {
              this.planLoading = false;
            });
            return;
          }
          // Decode the received chunk and append it to the planResponse.
          const chunk = decoder.decode(value, { stream: true });
          this.ngZone.run(() => {
            this.planResponse += chunk;
          });
          return processStream();
        };
        return processStream();
      }).catch(err => {
        console.error("Error fetching plan:", err);
        this.ngZone.run(() => {
          this.planResponse = "Error retrieving plan. Please try again.";
          this.planLoading = false;
        });
      });
    });
  }
}
