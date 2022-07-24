import { Car } from '../types/Car';

export const carFactory = (): Car => {
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
