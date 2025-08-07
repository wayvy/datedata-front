import { DateTime } from '@gravity-ui/date-utils';
import { SelectOption } from '@gravity-ui/uikit';
import { EventFormFieldValues, ICalendar } from '@repo/types';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { EventFormProps } from '../types';

export const useCalendarEventForm = ({ defaultValues, calendars }: EventFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<EventFormFieldValues>({ defaultValues });

  const [isAllDay, startDate] = watch(['allDay', 'startDate']);

  const calendarOptions: SelectOption<ICalendar>[] = calendars.map((calendar) => ({
    value: calendar.id,
    content: calendar.summary,
    data: calendar,
  }));

  const onStartDateUpdate = useCallback(
    (date: DateTime | null) => {
      if (!date) {
        return;
      }

      setValue('startDate', date);
    },
    [setValue],
  );

  const onStartDateBlur = useCallback(() => {
    const { startDate, endDate } = getValues();

    if (startDate.isAfter(endDate)) {
      setValue('endDate', startDate.add({ hours: 1 }));
    }
  }, [getValues, setValue]);

  const onEndDateUpdate = useCallback(
    (date: DateTime | null) => {
      if (!date) {
        return;
      }

      setValue('endDate', date);
    },
    [setValue],
  );

  const onEndDateBlur = useCallback(() => {
    const { startDate, endDate } = getValues();

    if (endDate.isBefore(startDate) || endDate.isSame(startDate)) {
      setValue('endDate', endDate.add({ days: 1 }));
    }
  }, [getValues, setValue]);

  const endDateValidate = useCallback(
    (end: DateTime) => {
      const start = getValues('startDate');

      if (!end || !start) {
        return true;
      }

      return end.isAfter(start) || 'End date must be after or equal to start date';
    },
    [getValues],
  );

  const onCalendarUpdate = useCallback(
    (value: string[]) => {
      if (value.length === 0) {
        return;
      }

      setValue('calendarId', value[0]);
    },
    [setValue],
  );

  return {
    register,
    handleSubmit,
    control,
    errors,
    isAllDay,
    startDate,
    calendarOptions,
    onStartDateUpdate,
    onStartDateBlur,
    onEndDateUpdate,
    onEndDateBlur,
    onCalendarUpdate,
    endDateValidate,
    getValues,
  };
};
