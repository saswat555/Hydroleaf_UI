import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { DeviceService } from '../../../../core/services/device.service';

interface DialogData {
  device?: any;
}

@Component({
  selector: 'app-device-configuration-dialog',
  templateUrl: './device-configuration-dialog.component.html',
  styleUrls: ['./device-configuration-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDividerModule
  ]
})
export class DeviceConfigurationDialogComponent implements OnInit {
  configForm: FormGroup;
  isSubmitting = false;
  deviceTypes = [
    { value: 'dosing_unit', label: 'Dosing Unit' },
    { value: 'ph_tds_sensor', label: 'pH/TDS Sensor' },
    { value: 'environment_sensor', label: 'Environment Sensor' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DeviceConfigurationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private deviceService: DeviceService,
    private snackBar: MatSnackBar
  ) {
    this.configForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', Validators.required],
      mqtt_topic: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9/_]+$')]],
      location_description: [''],
      pump_configurations: this.fb.array([]),
      sensor_parameters: this.fb.group({
        calibration: [''],
        measurement_interval: [30],
        alert_thresholds: ['']
      })
    });
  }

  get pumpConfigs() {
    return this.configForm.get('pump_configurations') as FormArray;
  }

  ngOnInit(): void {
    if (this.data?.device) {
      this.configForm.patchValue(this.data.device);
    }

    // Initialize pump configurations if type is dosing_unit
    this.configForm.get('type')?.valueChanges.subscribe(type => {
      if (type === 'dosing_unit') {
        this.initializePumpConfigs();
      }
    });
  }
  
  private initializePumpConfigs() {
    const pumps = this.pumpConfigs;
    pumps.clear();
  
    for (let i = 0; i < 4; i++) {
      pumps.push(this.fb.group({
        pump_number: [i + 1, Validators.required],  // Add pump_number
        chemical_name: ['', Validators.required],
        chemical_description: ['']
      }));
    }
  }
  

  onSubmit(): void {
    if (this.configForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const deviceData = this.configForm.value;

      this.deviceService.createDevice(deviceData).subscribe({
        next: (response) => {
          this.snackBar.open('Device configured successfully', 'Close', {
            duration: 3000
          });
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('Error configuring device:', error);
          this.snackBar.open('Error configuring device', 'Close', {
            duration: 3000
          });
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}