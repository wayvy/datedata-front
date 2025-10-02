import { CalendarFormFieldValues, ICalendar } from '@repo/types';

export type CalendarFormBaseProps = {
  className?: string;
  isOpen: boolean;
  isLoading: boolean;
};

export type CalendarFormEditProps = CalendarFormBaseProps & {
  onSubmit: (data: CalendarFormFieldValues, calendar: ICalendar) => Promise<void>;
  calendar: ICalendar;
  onDelete?: (calendar: ICalendar) => Promise<void>;
};

export type CalendarFormCreateProps = CalendarFormBaseProps & {
  onSubmit: (data: CalendarFormFieldValues) => Promise<void>;
  calendar?: undefined;
  onDelete?: undefined;
};

export type CalendarFormProps = CalendarFormEditProps | CalendarFormCreateProps;
