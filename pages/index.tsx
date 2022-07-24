import type { NextPage } from 'next';
import React from 'react';
import styled from 'styled-components';
import UnparkDialog, { Button } from '../components/UnparkModal';
import { AREA, CAR_SIZE, PARKING_SIZE } from '../constants';
import { usePark } from '../hooks/use-park';
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
  const [car, setNewCar] = React.useState<Car>();
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }
  return (
    <div>
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
        <Button
          variant="violet"
          onClick={() => {
            reset();
            setNewCar(carFactory());
          }}
        >
          Create Car
        </Button>
        <Button
          variant="violet"
          disabled={car === undefined || error !== undefined}
          onClick={() => {
            if (car) {
              setParking(car);
            }
            setNewCar(undefined);
          }}
        >
          {!error ? 'Park' : `Cant Parked. ${error}`}
        </Button>
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
