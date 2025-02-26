import { createReducer, on } from '@ngrx/store';
import { setPlants, clearPlants, setDevices, clearDevices } from './actions';
import { AppState } from './state.model';

export const initialState: AppState = {
  plants: [],
  devices: []
};

export const appReducer = createReducer(
  initialState,
  on(setPlants, (state, { plants }) => ({ ...state, plants })),
  on(clearPlants, (state) => ({ ...state, plants: [] })),
  on(setDevices, (state, { devices }) => ({ ...state, devices })),
  on(clearDevices, (state) => ({ ...state, devices: [] }))
);
