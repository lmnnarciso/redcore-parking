import { Car } from './Car';

export interface ParkingSpotLayout {
  entryPoint: number;
  distance: number;
  size: number;
  parkingRate: 20 | 60 | 100;
  vehicle: Car;
  parkingTime: null | number;
}

export type SpotSizes = 'small' | 'medium' | 'large';

export interface ParkingLayout {
  parkLayout: ParkingSpotLayout[][];
  numberOfEntryPoints: number[];
  setParking: (carDetails: Car) => void;
  error: string | undefined;
  reset: () => void;
  unpark: (slot: ParkingSpotLayout, carDetails: Car) => void;
  parkingHistory: ParkingHistory;
}

export interface ParkProps {
  [key: string]: {
    entryPoints: number;
    parkingSlotsPerEntryPoints: number;
  };
}

export type History = number;
export interface ParkingHistory {
  [key: string]: {
    history: History[];
    status: 'parked' | 'unparked';
  };
}
