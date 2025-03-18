// src/app/features/farms/farms.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FarmService, Farm } from '../../services/farm.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-farm',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './farms.component.html',
  styleUrls: ['./farms.component.scss']
})
export class FarmComponent {
  farms$: Observable<Farm[]>;

  constructor(private farmService: FarmService) {
    this.farms$ = this.farmService.getFarms();
  }
}
