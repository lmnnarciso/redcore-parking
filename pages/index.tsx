import type { NextPage } from 'next';
import React, { useId } from 'react';
import styled from 'styled-components';
import UnparkDialog from '../components/UnparkModal';
import { AREA, CAR_SIZE, PARKING_SIZE } from '../constants';
import { usePark } from '../hooks/use-park';
import styles from '../styles/Home.module.css';
import { Car } from '../types/Car';
import { carFactory } from '../utils/carFactory';

const Layout = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  justify-content: center;
`;

const ParkSlot = styled.div`
  background-color: cadetblue;
  padding: 3rem;
  border-radius: 4px;
  flex-basis: 200px;
`;

const Home: NextPage = () => {
  const {
    parkLayout,
    numberOfEntryPoints,
    setParking,
    error,
    reset,
    parkingHistory,
    unpark,
  } = usePark({
    entryPoint: 3,
    parkingSlotsPerEntryPoints: 5,
  });
  const id = useId();
  const [car, setNewCar] = React.useState<Car>();
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }
  // console.log(JSON.stringify(parkLayout, null, 4));
  return (
    <div className={styles.container}>
      {numberOfEntryPoints.map((entryPoint) => {
        return (
          <Layout key={entryPoint}>
            {parkLayout.map((item, idx) => (
              <ParkSlot
                key={item[entryPoint]?.id}
                // key={`${entryPoint}-${item[entryPoint].size}-${item[entryPoint].distance}`}
              >
                <div>
                  <h2>{AREA[entryPoint]}</h2>
                </div>
                <div>
                  <h2>{PARKING_SIZE[item[entryPoint].size]}</h2>
                </div>
                {item[entryPoint]?.vehicle?.size && (
                  <div>
                    <h2>{CAR_SIZE[item[entryPoint]?.vehicle?.size]}</h2>
                  </div>
                )}
                {item[entryPoint]?.vehicle &&
                  item[entryPoint].parkingTime !== null && (
                    <UnparkDialog
                      unpark={unpark}
                      parkSlot={item[entryPoint]}
                      history={parkingHistory}
                    />
                  )}
              </ParkSlot>
            ))}
          </Layout>
        );
      })}
      <Layout>
        <button
          onClick={() => {
            reset();
            setNewCar(carFactory());
          }}
        >
          Create Car
        </button>
        <button
          disabled={car === undefined || error !== undefined}
          onClick={() => {
            if (car) {
              setParking(car);
            }
            setNewCar(undefined);
          }}
        >
          {!error ? 'Park' : `Cant Parked. ${error}`}
        </button>
      </Layout>

      <div>
        <h2>Created Car</h2>
        <div>{car?.size}</div>
      </div>
      <div>
        <p>{JSON.stringify(parkingHistory, undefined, 4)}</p>
      </div>
    </div>
  );
};

export default Home;
