export const leadingZero = (value: number): string => {
  if (value <= 0) {
    return `${value}`;
  }

  return value < 10 ? `0${value}` : `${value}`;
};
