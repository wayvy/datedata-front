import { Temporal } from 'temporal-polyfill';

const getClientTimeZone = () => {
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();

  return timeZone;
};

export const localDateTimeToUTC = (localDateTime: Temporal.PlainDateTime): Temporal.Instant => {
  const timeZone = getClientTimeZone();

  return localDateTime.toZonedDateTime(timeZone).toInstant();
};

export const utcStringToLocalDateTime = (utcString: string): Temporal.PlainDateTime => {
  const timeZone = getClientTimeZone();

  return Temporal.Instant.from(utcString).toZonedDateTimeISO(timeZone).toPlainDateTime();
};
