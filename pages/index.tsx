import type { NextPage } from 'next';
import React from 'react';
import styled from 'styled-components';
import { usePark } from '../hooks/use-park';
import styles from '../styles/Home.module.css';
import { Car } from '../types/Car';

const carFactory = (): Car => {
  const randomSize = Math.round(Math.random() * 2);
  const carId = `CAR-${Math.round(Math.random() * 100)}`;
  const size: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];

  const carRate = {
    small: 20,
    medium: 60,
    large: 100,
  };

  return {
    id: carId,
    size: size[randomSize],
    rate: carRate[size[randomSize]],
  };
};

const ParkEntryPoint = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ParkSlot = styled.div`
  background-color: cadetblue;
  padding: 2zrem;
  border-radius: 4px;
`;

const Home: NextPage = () => {
  const { parkLayout, numberOfEntryPoints, setParking, error, reset } = usePark(
    {
      entryPoint: 3,
      parkingSlotsPerEntryPoints: 5,
    }
  );

  const [car, setNewCar] = React.useState<Car>();
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }
  console.log({ parkLayout, car });
  return (
    <div className={styles.container}>
      {numberOfEntryPoints.map((entryPoint) => {
        console.log({ entryPoint });
        return (
          <ParkEntryPoint key={entryPoint}>
            {parkLayout.map((item, idx) => (
              <ParkSlot
                key={`${entryPoint}-${item[entryPoint].size}-${item[entryPoint].distance}`}
              >
                {entryPoint} - {item[entryPoint].size} -{' '}
                {item[entryPoint].distance}
                {item[entryPoint].vehicleId}
              </ParkSlot>
            ))}
          </ParkEntryPoint>
        );
      })}
      <button
        onClick={() => {
          reset();
          setNewCar(carFactory());
        }}
      >
        Create Car
      </button>
      <button
        disabled={car !== undefined || error !== undefined}
        onClick={() => {
          if (car) {
            setParking(car);
          }
          setNewCar(undefined);
        }}
      >
        {!error ? 'Park' : `Cant Parked. ${error}`}
      </button>
    </div>
  );
};

export default Home;
