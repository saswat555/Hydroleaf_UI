// src/app/features/supply-chain/supply-chain.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupplyChainComponent } from './supply-chain.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

const routes: Routes = [
  { path: '', component: SupplyChainComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatInputModule,
    SupplyChainComponent
  ]
})
export class SupplyChainModule {}
