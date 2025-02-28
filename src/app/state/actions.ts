import { createAction, props } from '@ngrx/store';
import { Plant } from '../services/plant.service';

// Actions for Plants
export const setPlants = createAction('[Plant] Set Plants', props<{ plants: Plant[] }>());
export const clearPlants = createAction('[Plant] Clear Plants');

// Actions for Devices
export const setDevices = createAction('[Device] Set Devices', props<{ devices: any[] }>());
export const clearDevices = createAction('[Device] Clear Devices');

export const setPhTdsDevice = createAction(
  '[Device] Set pH & TDS Data',
  props<{ devices: { [key: number]: { pH: number; TDS: number } } }>()
);

