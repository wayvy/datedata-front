import { CalendarFormFieldValues, ICalendar } from '@repo/types';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export const useCalendarForm = ({ calendar, isOpen }: { calendar?: ICalendar; isOpen: boolean }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<CalendarFormFieldValues>({
    defaultValues: {
      summary: calendar?.summary ?? '',
      description: calendar?.description ?? '',
      color: calendar?.color ?? 'transparent',
    },
  });

  useEffect(() => {
    return () => {
      reset();
    };
  }, [isOpen, reset]);

  return {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  };
};
