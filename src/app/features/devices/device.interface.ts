export interface Device {
    id?: number;
    name: string;
    type: 'dosing_unit' | 'ph_tds_sensor' | 'environment_sensor';
    mqtt_topic: string;
    location_description?: string;
    created_at?: string;
    updated_at?: string;
    is_active?: boolean;
    last_seen?: string;
    pump_configurations?: any[]; // Define proper type if needed
    sensor_parameters?: any; // Define proper type if needed
  }
  
  export interface DiscoveredDevice {
    id: string;
    name?: string;
    type?: string;
    status?: string;
    mqtt_topic?: string;
  }