import { DateTime, dateTime } from '@gravity-ui/date-utils';
import { Temporal } from 'temporal-polyfill';

export const temporalToGravityDate = (date: Temporal.PlainDateTime): DateTime => {
  return dateTime({
    input: date.toString(),
  });
};

export const gravityDateToTemporal = (date: DateTime): Temporal.PlainDateTime => {
  return Temporal.PlainDateTime.from(date.toISOString(true));
};
