import { Plant } from "../services/plant.service";

export interface AppState {
    plants: Plant[];
    devices: any[];
  }
  