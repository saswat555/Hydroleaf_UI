// src/app/features/supply-chain/supply-chain.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-supply-chain',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './supply-chain.component.html',
  styleUrls: ['./supply-chain.component.scss']
})
export class SupplyChainComponent {
  origin = '';
  destination = '';
  produceType = '';
  weightKg = 0;
  transportMode = 'railway';
  result: any = null;
  loading = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  analyze() {
    this.loading = true;
    this.error = null;
    this.result = null;

    const payload = {
      origin: this.origin,
      destination: this.destination,
      produce_type: this.produceType,
      weight_kg: this.weightKg,
      transport_mode: this.transportMode
    };

    this.http.post('http://localhost:8000/api/v1/supply_chain', payload)
      .subscribe({
        next: (res) => {
          this.result = res;
          this.loading = false;
        },
        error: (err) => {
          console.error('Supply chain analysis failed:', err);
          this.error = 'Supply chain analysis failed.';
          this.loading = false;
        }
      });
  }
}
