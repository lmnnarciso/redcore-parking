import { Car } from './Car';

export interface ParkingSpotLayout {
  entryPoint: number;
  distance: number;
  size: number;
  vehicleId: null | number;
  parkingRate: 20 | 60 | 100;
}

export type SpotSizes = 'small' | 'medium' | 'large';

export interface ParkingLayout {
  parkLayout: ParkingSpotLayout[][];
  numberOfEntryPoints: number[];
  setParking: (carDetails: Car) => void;
  error: string | undefined;
  reset: () => void;
}

export interface ParkProps {
  [key: string]: {
    entryPoints: number;
    parkingSlotsPerEntryPoints: number;
  };
}
