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
import { DeviceService } from '../../../../services/device.service';
import { firstValueFrom } from 'rxjs';

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
      http_endpoint: [''],
      location_description: [''],
      pump_configurations: this.fb.array([]),
      sensor_parameters: this.fb.group({
        calibration: [''],
        measurement_interval: [30],
        alert_thresholds: ['']
      })
    });
    
  }

  get pumpConfigs(): FormArray {
    return this.configForm.get('pump_configurations') as FormArray;
  }

  ngOnInit(): void {
    if (this.data?.device) {
      this.configForm.patchValue(this.data.device);
    }
  
    // Instead of auto‑initializing pump configs when type is 'dosing_unit',
    // just clear them. Let the user add pump configs manually.
    this.configForm.get('type')?.valueChanges.subscribe(type => {
      if (type !== 'dosing_unit') {
        this.pumpConfigs.clear();
      }
    });
  }
  addPumpConfig(): void {
    const pumpGroup = this.fb.group({
      pump_number: ['', Validators.required],
      chemical_name: ['', Validators.required],
      chemical_description: ['']
    });
    this.pumpConfigs.push(pumpGroup);
  }
    

  private initializePumpConfigs(): void {
    const pumps = this.pumpConfigs;
    pumps.clear();

    for (let i = 0; i < 4; i++) {
      pumps.push(this.fb.group({
        pump_number: [i + 1, Validators.required], 
        chemical_name: ['', Validators.required],
        chemical_description: ['']
      }));
    }
  }

  /** ✅ Converts pump_configurations array to required key-value object format */
  private formatPumpConfigurations(): any {
    const pumpsArray = this.configForm.value.pump_configurations || [];
    const pumpsObject: any = {};
    
    pumpsArray.forEach((pump: any, index: number) => {
      pumpsObject[`pump${index + 1}`] = {
        chemical_name: pump.chemical_name,
        chemical_description: pump.chemical_description
      };
    });

    return pumpsObject;
  }

  /** ✅ Registers the device before saving its configuration */
  private registerDevice(deviceData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.deviceService.registerDevice(deviceData).subscribe({
        next: (response) => {
          console.log("✅ Device Registered:", response);
          resolve(response);
        },
        error: (error) => {
          console.error("❌ Device Registration Failed:", error);
          this.snackBar.open('Device registration failed', 'Close', { duration: 3000 });
          reject(error);
        }
      });
    });
  }

  async onSubmit(): Promise<void> {
    if (this.configForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      let deviceData = { ...this.configForm.value };
  
      if (deviceData.type === 'dosing_unit') {
        // Filter out any pump configuration that does not have a valid chemical_name
        deviceData.pump_configurations = this.pumpConfigs.value.filter(
          (pump: any) => pump.chemical_name && pump.chemical_name.trim().length > 0
        );
      }
  
      try {
        // Check if the device already exists
        const devices = await firstValueFrom(this.deviceService.getDevices());
        const existingDevice = devices.find(d => d.http_endpoint === deviceData.http_endpoint);
  
        if (existingDevice) {
          console.log("🔄 Device already exists. Registering in LLM...");
          await firstValueFrom(this.deviceService.registerDevice(deviceData)); // Manually register in LLM
        } else {
          console.log("🆕 Registering new device...");
          await firstValueFrom(this.deviceService.createDevice(deviceData));
        }
  
        // Successfully registered
        this.snackBar.open('Device registered successfully', 'Close', { duration: 3000 });
        this.dialogRef.close(deviceData);
  
      } catch (error) {
        console.error('❌ Error:', error);
        this.snackBar.open('Error registering device', 'Close', { duration: 3000 });
      } finally {
        this.isSubmitting = false;
      }
    }
  }
  

  onCancel(): void {
    this.dialogRef.close();
  }
}
