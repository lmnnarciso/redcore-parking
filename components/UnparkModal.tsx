import { blackA, mauve, red, violet } from '@radix-ui/colors';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { ParkingHistory, ParkingSpotLayout } from '../types/Park';

const overlayShow = keyframes`
  0% { opacity: 0 }
  100% { opacity: 1 }
`;

const contentShow = keyframes`
  0% { opacity: 0; transform: 'translate(-50%, -48%) scale(.96)'; }
  100% { opacity: 1; transform: 'translate(-50%, -50%) scale(1)'; }
`;

const StyledOverlay = styled(AlertDialogPrimitive.Overlay)`
  background-color: ${blackA.blackA9};
  position: fixed;
  inset: 0;
  @media (prefers-reduced-motion: no-preference) {
    animation: ${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
  }
`;

const StyledContent = styled(AlertDialogPrimitive.Content)`
  background-color: white;
  border-radius: 6px;
  box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
    hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 500px;
  max-height: 85vh;
  padding: 25px;
  @media (prefers-reduced-motion: no-preference) {
    animation: ${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  &:focus {
    outline: 'none';
  }
`;

interface ContentProps {
  children?: React.ReactNode;
}

function Content({ children, ...props }: ContentProps) {
  return (
    <AlertDialogPrimitive.Portal>
      <StyledOverlay />
      <StyledContent {...props}>{children}</StyledContent>
    </AlertDialogPrimitive.Portal>
  );
}

const StyledTitle = styled(AlertDialogPrimitive.Title)`
  margin: 0;
  color: ${mauve.mauve12};
  font-size: 17px;
  font-weight: 600;
`;

const StyledDescription = styled(AlertDialogPrimitive.Description)`
  margin-bottom: 20px;
  color: ${mauve.mauve11};
  font-size: 15px;
  line-height: 1.5;
`;

const AlertDialogDiv = styled.div`
  margin-bottom: 20px;
  color: ${mauve.mauve11};
  font-size: 15px;
  line-height: 1.5;
`;

// Exports
export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogContent = Content;
export const AlertDialogTitle = StyledTitle;
export const AlertDialogDescription = StyledDescription;
export const AlertDialogAction = AlertDialogPrimitive.Action;
export const AlertDialogCancel = AlertDialogPrimitive.Cancel;

// Your app...
const Flex = styled.div`
  display: flex;
`;

const buttonVariants = ({
  variant,
}: {
  variant: 'violet' | 'red' | 'mauve' | undefined;
}) => {
  const VARIANT = {
    violet: {
      backgroundColor: 'white',
      color: violet.violet11,
      boxShadow: `0 2px 10px ${blackA.blackA7}`,
      '&:hover': { backgroundColor: mauve.mauve3 },
      '&:focus': { boxShadow: `0 0 0 2px black` },
    },
    red: {
      backgroundColor: red.red4,
      color: red.red11,
      '&:hover': { backgroundColor: red.red5 },
      '&:focus': { boxShadow: `0 0 0 2px ${red.red7}` },
    },
    mauve: {
      backgroundColor: mauve.mauve4,
      color: mauve.mauve11,
      '&:hover': { backgroundColor: mauve.mauve5 },
      '&:focus': { boxShadow: `0 0 0 2px ${mauve.mauve7}` },
    },
  };
  if (!variant) {
    return {};
  }
  return VARIANT[variant];
};
interface ButtonProps {
  variant?: 'mauve' | 'red' | 'violet';
}
const Button = styled.button<ButtonProps>`
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  padding: 0px 15px;
  font-size: 15px;
  line-height: 1;
  font-weight: 600;
  height: 35px;
  cursor: pointer;
  /* background-color: ${mauve.mauve4};
      color: ${mauve.mauve11},
      &:hover{ backgroundColor: mauve.mauve5 }
      &:focus { boxShadow: 0 0 0 2px ${mauve.mauve7} },
    }, */
  ${({ variant }) => buttonVariants({ variant: variant })}
`;

interface UnparkDialogProps {
  parkSlot: ParkingSpotLayout;
  history: ParkingHistory;
  unpark: any;
}

const UnparkDialog = ({ parkSlot, history, unpark }: UnparkDialogProps) => {
  const [elapsedTime, setElapseTime] = useState(0);
  const [overrideLapseParkTime, setOverrideLapseParkTime] = useState(0);

  const [toPay, setToPay] = useState(0);
  const parkingCalculation = () => {
    if (overrideLapseParkTime > 0) {
      const totalHours = overrideLapseParkTime / 60;
      if (totalHours >= 24) {
        const totalDays = totalHours / 24;
        const cleanedDays = totalDays - (totalDays % 1);
        const remainingHours = Number(((totalDays % 1) * 24).toFixed(2));

        const total =
          cleanedDays * 5000 +
          Math.round(remainingHours) * parkSlot.parkingRate;
        console.log({ over24: total });
        setToPay(total);
      } else {
        const total = Math.round(totalHours) * parkSlot.parkingRate;
        setToPay(total);
      }
    } else {
      const totalHours = elapsedTime / 60;
      if (totalHours >= 24) {
        const totalDays = totalHours / 24;
        const cleanedDays = totalDays - (totalDays % 1);
        const remainingHours = Number(((totalDays % 1) * 24).toFixed(2));

        const total =
          cleanedDays * 5000 +
          Math.round(remainingHours) * parkSlot.parkingRate;
        console.log({ over24: total });
        setToPay(total);
      } else {
        const total = Math.round(totalHours) * parkSlot.parkingRate;
        setToPay(total);
      }
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const timeNow = Math.floor(new Date().getTime() / 1000);
      if (parkSlot.parkingTime) {
        const minutesDifference = Math.round(
          (timeNow - parkSlot.parkingTime) / 60
        );
        setElapseTime(minutesDifference);
      }
      return () => {
        clearInterval(intervalId);
      };
    }, 1000);
  }, [elapsedTime]);

  useEffect(() => {
    parkingCalculation();
  }, [elapsedTime]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="violet">Unpark</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Unparking</AlertDialogTitle>
        <AlertDialogDiv>
          <AlertDialogDescription>
            <p>Parked Time: {overrideLapseParkTime}</p>
          </AlertDialogDescription>
          <div>
            <h3>Hourly Rate: {parkSlot.parkingRate}</h3>
            <h2>To Pay: {toPay}</h2>
          </div>
          <div>
            <label>Custom Lapse Parking Time: </label>
            <input
              type="number"
              onChange={(e) => {
                setOverrideLapseParkTime(Number(e.target.value));
              }}
            />
            <Button
              variant="violet"
              onClick={() => {
                parkingCalculation();
              }}
            >
              Set Lapsed Time
            </Button>
          </div>
        </AlertDialogDiv>
        <Flex style={{ justifyContent: 'flex-end' }}>
          <AlertDialogCancel asChild>
            <Button variant="mauve" style={{ marginRight: 25 }}>
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="red"
              onClick={() => {
                unpark(parkSlot);
              }}
            >
              Unpark
            </Button>
          </AlertDialogAction>
        </Flex>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UnparkDialog;
