import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Plant } from './plant.service';

@Injectable({
  providedIn: 'root'
})
export class SharedStateService {
  private plantsSubject = new BehaviorSubject<Plant[]>([]);
  plants$ = this.plantsSubject.asObservable();

  private devicesSubject = new BehaviorSubject<any[]>([]);
  devices$ = this.devicesSubject.asObservable();

  setPlants(plants: Plant[]) {
    this.plantsSubject.next(plants);
  }

  setDevices(devices: any[]) {
    this.devicesSubject.next(devices);
  }
}
