// src/app/features/devices/device.interface.ts
export interface Device {
  id: number;
  name: string;
  type: 'dosing_unit' | 'ph_tds_sensor' | 'environment_sensor';
  http_endpoint: string;
  location_description?: string;
  status?: string;      // e.g., "Online" or "Offline"
  version?: string;     // Device firmware/version info
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  last_seen?: string;
  pump_configurations?: any[]; // Ensure this matches the backend response structure
  sensor_parameters?: any;
  owner_email?: string; // <-- Added for admin display
}


export interface DiscoveredDevice {
  id: string;
  name?: string;
  type?: string;
  status?: string;
  http_endpoint?: string;
}
