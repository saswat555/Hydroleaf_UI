import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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

/**
 * Custom validator for pump_configurations.
 * If type is "dosing_unit", ensure that the pump_configurations FormArray has at least one item.
 */
function pumpConfigsConditionalValidator(formGroup: AbstractControl): ValidationErrors | null {
  const type = formGroup.get('type')?.value;
  const pumpConfigs = formGroup.get('pump_configurations') as FormArray;
  if (type === 'dosing_unit' && pumpConfigs && pumpConfigs.length < 1) {
    return { pumpConfigsRequired: true };
  }
  return null;
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
    // Create the form group.
    // http_endpoint now requires a valid URL starting with http:// or https://
    this.configForm = this.fb.group({
      mac_id: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', Validators.required],
      http_endpoint: ['', [Validators.required, Validators.pattern(/^https?:\/\/.*/)]],
      location_description: [''],
      farm_id: ['', Validators.required],
      pump_configurations: this.fb.array([]),
      sensor_parameters: this.fb.group({
        calibration: [''],
        measurement_interval: [30],
        alert_thresholds: ['']
      })
    }, { validators: pumpConfigsConditionalValidator });
  }

  get pumpConfigs(): FormArray {
    return this.configForm.get('pump_configurations') as FormArray;
  }

  ngOnInit(): void {
    if (this.data?.device) {
      // Auto-populate mac_id: extract value after underscore from device name if not provided.
      let mac_id = this.data.device.mac_id || '';
      if (!mac_id && this.data.device.name && this.data.device.name.includes('_')) {
        const parts = this.data.device.name.split('_');
        if (parts.length > 1) {
          mac_id = parts[1];
        }
      }
      // Repopulate http_endpoint from device ip if not provided.
      const defaultHttpEndpoint = this.data.device.http_endpoint 
        || (this.data.device.ip ? `http://${this.data.device.ip}` : '');
  
      const deviceData = {
        mac_id: mac_id,
        name: this.data.device.name || '',
        type: this.data.device.type ? this.data.device.type.toLowerCase() : '',
        http_endpoint: defaultHttpEndpoint,
        location_description: this.data.device.location_description || '',
        farm_id: this.data.device.farm_id || '',
        pump_configurations: this.data.device.pump_configurations || [],
        sensor_parameters: this.data.device.sensor_parameters || { calibration: '', measurement_interval: 30, alert_thresholds: '' }
      };
      this.configForm.patchValue(deviceData);
    }
  
    // Listen for changes in pump_configurations array to update the overall form validity.
    this.pumpConfigs.valueChanges.subscribe(() => {
      this.configForm.updateValueAndValidity();
    });
  
    // When type changes, if type is dosing_unit and no pump config exists, add one.
    this.configForm.get('type')?.valueChanges.subscribe(type => {
      if (type === 'dosing_unit' && this.pumpConfigs.length === 0) {
        this.addPumpConfig();
      } else if (type !== 'dosing_unit') {
        this.pumpConfigs.clear();
      }
      this.configForm.updateValueAndValidity();
    });
  }
  
  addPumpConfig(): void {
    const pumpGroup = this.fb.group({
      pump_number: [this.pumpConfigs.length + 1, Validators.required],
      chemical_name: ['', Validators.required],
      chemical_description: ['']
    });
    this.pumpConfigs.push(pumpGroup);
    this.configForm.updateValueAndValidity({ onlySelf: false, emitEvent: true });
  }
  
  async onSubmit(): Promise<void> {
    if (this.configForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      let deviceData = { ...this.configForm.value };
      
      // Convert farm_id to an integer.
      if (deviceData.farm_id) {
        deviceData.farm_id = parseInt(deviceData.farm_id, 10);
      }
  
      if (deviceData.type === 'dosing_unit') {
        deviceData.pump_configurations = this.pumpConfigs.value.filter(
          (pump: any) => pump.chemical_name && pump.chemical_name.trim().length > 0
        );
        if (deviceData.pump_configurations.length < 1) {
          this.snackBar.open('Please add at least one pump configuration', 'Close', { duration: 3000 });
          this.isSubmitting = false;
          return;
        }
      }
  
      try {
        console.log("Registering device with data:", deviceData);
        await firstValueFrom(this.deviceService.createDevice(deviceData));
        this.snackBar.open('Device registered successfully', 'Close', { duration: 3000 });
        this.dialogRef.close(deviceData);
      } catch (error) {
        console.error('Error registering device:', error);
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
