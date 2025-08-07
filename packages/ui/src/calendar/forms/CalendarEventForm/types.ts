import { ICalendar, EventFormFieldValues, ICalendarEvent } from '@repo/types';

export type EventFormBaseProps = {
  className?: string;
  deleteDangerClassName?: string;
  isLoading?: boolean;
  defaultValues: Partial<EventFormFieldValues> & Pick<EventFormFieldValues, 'startDate' | 'endDate' | 'calendarId'>;
  onSubmit: (data: EventFormFieldValues) => void;
  calendars: ICalendar[];
  dateFormat?: string;
};

export type EventFormEditProps = EventFormBaseProps & {
  event: ICalendarEvent;
  onDelete: (event: ICalendarEvent) => Promise<void>;
};

export type EventFormCreateProps = EventFormBaseProps & {
  event?: undefined;
  onDelete?: undefined;
};

export type EventFormProps = EventFormEditProps | EventFormCreateProps;
