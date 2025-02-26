import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule, NgIf, NgForOf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../state/state.model';
import { setDevices } from '../../state/actions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    NgIf,
    NgForOf
  ]
})
export class DashboardComponent implements OnInit {
  devices$: Observable<any[]>;  // ✅ Using Observable from Store
  displayedColumns: string[] = ['id', 'name', 'http_endpoint', 'pump_configurations', 'actions'];
  loading: boolean = true;

  constructor(private http: HttpClient, private store: Store<{ app: AppState }>) {
    this.devices$ = this.store.pipe(select(state => state.app.devices));  // ✅ Get devices from store
  }

  ngOnInit(): void {
    this.fetchDevices();
  }

  fetchDevices(): void {
    this.http.get<any[]>('http://localhost:8000/api/v1/devices').subscribe({
      next: (data) => {
        console.log('Devices fetched:', data);
        this.store.dispatch(setDevices({ devices: data }));  // ✅ Save devices in NgRx state
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching devices', err);
        this.loading = false;
      }
    });
  }

  viewDevice(id: number): void {
    console.log('View device with ID:', id);
  }
}
