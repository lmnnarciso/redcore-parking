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
  return (
    <div className={styles.container}>
      {parkLayout.map((rows, idx) => {
        return (
          <Layout key={idx}>
            {rows.map((item, idx2) => (
              <ParkSlot key={item.id}>
                <div>
                  <h2>{AREA[idx2]}</h2>
                </div>
                <div>
                  <h2>{PARKING_SIZE[item.size]}</h2>
                </div>
                {item.vehicle && (
                  <div>
                    <h2>{CAR_SIZE[item.vehicle.size]}</h2>
                  </div>
                )}
                {item.vehicle && (
                  <UnparkDialog
                    unpark={unpark}
                    parkSlot={item}
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
