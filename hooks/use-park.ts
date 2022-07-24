import React from 'react';
import { Car } from '../types/Car';
import {
  ParkingHistory,
  ParkingLayout,
  ParkingSpotLayout,
  SpotSizes,
} from '../types/Park';

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

const getParkingRate = (size: number) => {
  switch (size) {
    case 2:
      return 100;
    case 1:
      return 60;
    default:
      return 20;
  }
};

export const usePark = ({
  entryPoint = 3,
  parkingSlotsPerEntryPoints = 5,
}): ParkingLayout => {
  const parkSlotSizeGenerator = (parkingSlotTupleArray: any) => {
    const transformedParkingSlot = parkingSlotTupleArray.reduce(
      (acc: any, cur: any) => {
        return [
          ...acc,
          cur.reduce((acc2: any, cur2: any, idx2: number) => {
            const randomSize = Math.round(Math.random() * 2);

            return [
              ...acc2,
              {
                entryPoint: idx2,
                distance: cur2,
                size: randomSize,
                vehicle: null,
                parkingTime: null,
                parkingRate: getParkingRate(randomSize),
              },
            ];
          }, []),
        ];
      },
      []
    );
    return transformedParkingSlot;
  };

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

  const initialParkSlotDistance = parkSlotDistanceGenerator();

  const initialParkLayout = parkSlotSizeGenerator(initialParkSlotDistance);

  const getParkingSizeAvailability = (carDetails: Car) => {
    let carSize = getSize(carDetails.size);
    let foundAvailableSpace;
    let foundSize = -1;
    if (carSize === 2) {
      foundAvailableSpace = park.some((row: ParkingSpotLayout[]) =>
        row.some((item) => item.size === carSize && item.vehicle === null)
      );
      if (foundAvailableSpace) {
        foundSize = 2;
      }
    } else if (carSize === 1) {
      for (let i = carSize; i <= 2; i++) {
        foundAvailableSpace = park.some((row: ParkingSpotLayout[]) =>
          row.some((item) => item.size === i && item.vehicle === null)
        );
        if (foundAvailableSpace) {
          foundSize = i;
          break;
        }
      }
    } else {
      for (let i = carSize; i <= 2; i++) {
        foundAvailableSpace = park.some((row: ParkingSpotLayout[]) =>
          row.some((item) => item.size === i && item.vehicle === null)
        );
        if (foundAvailableSpace) {
          foundSize = i;
          break;
        }
      }
    }
    return { isAvailable: foundAvailableSpace, size: foundSize };
  };

  const [parkingHistory, setParkingHistory] = React.useState<ParkingHistory>(
    {}
  );
  const [park, setParkSlot] = React.useState(initialParkLayout);
  const [error, setError] = React.useState<string | undefined>(undefined);

  const setParking = (carDetails: Car) => {
    let isParkingFound = false;
    let { isAvailable, size } = getParkingSizeAvailability(carDetails);
    console.log({ isAvailable });
    const findProperParkingSlot = park.map((rows: ParkingSpotLayout[]) => {
      return rows.map((slot: ParkingSpotLayout) => {
        if (
          isAvailable &&
          isParkingFound === false &&
          slot.vehicle === null &&
          size === slot.size
        ) {
          isParkingFound = true;
          return {
            ...slot,
            vehicle: carDetails,
            parkingTime: Math.floor(new Date().getTime() / 1000),
          };
        }
        return slot;
      });
    }, []);
    if (isParkingFound) {
      setParkSlot(findProperParkingSlot);
      setParkingHistory({
        ...parkingHistory,
        [carDetails.id]: {
          history: parkingHistory?.[carDetails.id]
            ? [
                ...parkingHistory?.[carDetails.id].history,
                Math.floor(new Date().getTime() / 1000),
              ]
            : [Math.floor(new Date().getTime() / 1000)],
          status: 'parked',
        },
      });
      setError(undefined);
    } else {
      setError('No Parking Found!');
    }
  };

  const unpark = (slot: ParkingSpotLayout) => {
    const unparkedCarLayout = park.reduce(
      (acc: ParkingSpotLayout[][], cur: ParkingSpotLayout[]) => {
        return [
          ...acc,
          cur.map((parkSlot: ParkingSpotLayout) => {
            if (parkSlot.vehicle !== null) {
              if (parkSlot.vehicle.id === slot.vehicle.id) {
                return {
                  ...parkSlot,
                  vehicle: null,
                  parkingTime: null,
                };
              }
            }
            return parkSlot;
          }),
        ];
      },
      []
    );

    setParkSlot(unparkedCarLayout);
    setParkingHistory({
      ...parkingHistory,
      [slot.vehicle.id]: {
        history: [
          ...parkingHistory?.[slot.vehicle.id].history,
          Math.floor(new Date().getTime() / 1000),
        ],
        status: 'unparked',
      },
    });
  };

  const reset = () => {
    setError(undefined);
  };
  return {
    parkLayout: park,
    setParking,
    error,
    reset,
    unpark,
    numberOfEntryPoints: Array.from(Array(3).keys()),
    parkingHistory,
  };
};
