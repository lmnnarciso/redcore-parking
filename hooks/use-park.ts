import React from 'react';
import { Car } from '../types/Car';
import { ParkingLayout, ParkingSpotLayout, SpotSizes } from '../types/Park';

export const usePark = ({
  entryPoint = 3,
  parkingSlotsPerEntryPoints = 5,
}): ParkingLayout => {
  const parkSlotDistanceGenerator = () => {
    const entryPointsArray = [
      [2, 1, 4],
      [1, 3, 5],
      [3, 4, 2],
      [5, 2, 1],
      [4, 5, 3],
    ];
    return entryPointsArray;
  };
  const getSize = (size: SpotSizes) => {
    switch (size) {
      case 'large':
        return 2;
      case 'medium':
        return 1;
      case 'small':
        return 0;
    }
  };

  const parkSlotSizeGenerator = (parkingSlotTupleArray: any) => {
    const transformedParkingSlot = parkingSlotTupleArray.reduce(
      (acc: any, cur: any) => {
        return [
          ...acc,
          cur.reduce((acc2: any, cur2: any, idx2: number) => {
            return [
              ...acc2,
              {
                entryPoint: idx2,
                distance: cur2,
                size: Math.round(Math.random() * 2),
                vehicleId: null,
              },
            ];
          }, []),
        ];
      },
      []
    );
    return transformedParkingSlot;
  };

  const initialParkSlotDistance = parkSlotDistanceGenerator();

  const initialParkLayout = parkSlotSizeGenerator(initialParkSlotDistance);

  const [parkingHistory, setParkingHistory] = React.useState({});
  const [park, setParkSlot] = React.useState(initialParkLayout);
  const [error, setError] = React.useState<string | undefined>(undefined);

  const setParking = (carDetails: Car) => {
    let isParkingFound = false;
    const findProperParkingSlot = park.map((rows: ParkingSpotLayout[]) => {
      return rows.map((slot: ParkingSpotLayout) => {
        if (
          slot.size === getSize(carDetails.size) &&
          isParkingFound === false &&
          slot.vehicleId === null
        ) {
          isParkingFound = true;
          return {
            ...slot,
            vehicleId: carDetails.id,
          };
        }
        return slot;
      });
    }, []);

    if (isParkingFound) {
      setParkSlot(findProperParkingSlot);
      setError(undefined);
    } else {
      setError('No Parking Found!');
    }
  };

  const reset = () => {
    setError(undefined);
  };

  return {
    parkLayout: park,
    setParking,
    error,
    reset,
    numberOfEntryPoints: Array.from(Array(3).keys()),
  };
};
