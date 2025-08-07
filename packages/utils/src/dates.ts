import { Temporal } from 'temporal-polyfill';

export const dateToNextNearestHalfHour = (date: Temporal.PlainDateTime, minutesRound = 30): Temporal.PlainDateTime => {
  const hour = date.hour;
  const minute = date.minute;

  if (hour > 23 && minute > minutesRound) {
    return date.add({ days: 1 }).with({ hour: 0, minute: 0 });
  }

  if (minute > minutesRound) {
    return date.with({ hour: date.hour + 1, minute: 0 });
  }

  return date.with({ minute: Math.ceil(minute / minutesRound) * minutesRound });
};
