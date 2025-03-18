import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FarmComponent } from './farms.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

const routes: Routes = [
  { path: '', component: FarmComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    FarmComponent  // Import standalone component here instead of declaring it
  ]
})
export class FarmsModule { }
