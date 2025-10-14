import { Temporal } from 'temporal-polyfill';

export const getDefaultEndTime = (startDate: Temporal.PlainDateTime, duration = 30): Temporal.PlainDateTime => {
  return startDate.add({ minutes: duration });
};
