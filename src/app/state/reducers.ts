import { createReducer, on } from '@ngrx/store';
import { setPlants, clearPlants, setDevices, clearDevices,setPhTdsDevice } from './actions';
import { AppState } from './state.model';

export interface DeviceState {
  phTdsReadings: { [key: number]: { pH: number; TDS: number } };
}

export const initialState: AppState = {
  plants: [],
  devices: [],
  phTdsReadings: {}
};

export const appReducer = createReducer(
  initialState,
  on(setPlants, (state, { plants }) => ({ ...state, plants })),
  on(clearPlants, (state) => ({ ...state, plants: [] })),
  on(setDevices, (state, { devices }) => ({ ...state, devices })),
  on(clearDevices, (state) => ({ ...state, devices: [] })),
  on(setPhTdsDevice, (state, { devices }) => ({
    ...state,
    phTdsReadings: { ...state.phTdsReadings, ...devices } // ✅ Merge new readings
  }))
);
