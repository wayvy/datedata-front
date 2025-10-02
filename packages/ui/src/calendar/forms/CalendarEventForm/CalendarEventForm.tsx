import { DatePicker } from '@gravity-ui/date-components';
import { DateTime } from '@gravity-ui/date-utils';
import { Button, Switch, TextArea, TextInput } from '@gravity-ui/uikit';
import { EventFormFieldValues } from '@repo/types';
import clsx from 'clsx';
import { memo, useCallback } from 'react';
import { Controller, ControllerRenderProps } from 'react-hook-form';

import { DeleteDangerButton } from '../../../components';

import CalendarSelect from './CalendarSelect';
import { useCalendarEventForm } from './hooks/useCalendarEventForm';
import { EventFormProps } from './types';

import s from './CalendarEventForm.module.scss';

const DATE_FORMAT = 'DD.MM.YYYY    HH:mm';

const TEXT_INPUT_SIZE = 'm';
const CALENDAR_SIZE = TEXT_INPUT_SIZE;
const SWITCH_SIZE = TEXT_INPUT_SIZE;
const BUTTON_SIZE = TEXT_INPUT_SIZE;
const CALENDAR_SELECT_SIZE = TEXT_INPUT_SIZE;

const CalendarEventForm: React.FC<EventFormProps> = ({
  className,
  defaultValues,
  onSubmit,
  calendars,
  isLoading,
  event,
  onDelete,
  dateFormat = DATE_FORMAT,
}) => {
  const {
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
  } = useCalendarEventForm({ defaultValues, calendars, onSubmit });

  const handleDelete = useCallback(async () => {
    if (!event || !onDelete) {
      return;
    }

    await onDelete(event);
  }, [event, onDelete]);

  const isEndDateUnavailable = useCallback(
    (date: DateTime) => {
      return date.isBefore(getValues('startDate'));
    },
    [getValues],
  );

  const renderStartDate = useCallback(
    ({ field }: { field: ControllerRenderProps<EventFormFieldValues, 'startDate'> }) => {
      return (
        <DatePicker
          format={dateFormat}
          {...field}
          onUpdate={onStartDateUpdate}
          onBlur={onStartDateBlur}
          className={s.root__date}
          size={CALENDAR_SIZE}
          label="start"
        />
      );
    },
    [dateFormat, onStartDateBlur, onStartDateUpdate],
  );

  const renderEndDate = useCallback(
    ({ field }: { field: ControllerRenderProps<EventFormFieldValues, 'endDate'> }) => {
      return (
        <DatePicker
          {...field}
          format={dateFormat}
          onUpdate={onEndDateUpdate}
          onBlur={onEndDateBlur}
          validationState={errors.endDate ? 'invalid' : undefined}
          errorMessage={errors.endDate?.message}
          errorPlacement="inside"
          className={s.root__date}
          size={CALENDAR_SIZE}
          label="end"
          isDateUnavailable={isEndDateUnavailable}
        />
      );
    },
    [dateFormat, onEndDateUpdate, onEndDateBlur, errors.endDate, isEndDateUnavailable],
  );

  const renderCalendarId = useCallback(
    ({ field }: { field: ControllerRenderProps<EventFormFieldValues, 'calendarId'> }) => {
      return (
        <CalendarSelect
          field={field}
          options={calendarOptions}
          onUpdate={onCalendarUpdate}
          width="max"
          label="calendar"
          size={CALENDAR_SELECT_SIZE}
          className={s['root__calendar-select']}
        />
      );
    },
    [calendarOptions, onCalendarUpdate],
  );

  return (
    <form className={clsx(s.root, className)} onSubmit={handleSubmit(onSubmit)}>
      <div className={s.root__content}>
        <Switch
          {...register('allDay')}
          size={SWITCH_SIZE}
          defaultChecked={defaultValues.allDay}
          content="all day"
          className={s.root__switch}
        />
        <TextInput
          {...register('title', { required: 'Title is required' })}
          error={errors.title?.message}
          size={TEXT_INPUT_SIZE}
          label="title"
          autoComplete={false}
          autoFocus
        />
        <Controller control={control} name="startDate" render={renderStartDate} />
        {isAllDay ? (
          <DatePicker
            format={dateFormat}
            value={startDate}
            disabled
            className={s.root__date}
            size={CALENDAR_SIZE}
            label="end"
          />
        ) : (
          <Controller
            control={control}
            name="endDate"
            rules={{
              validate: endDateValidate,
            }}
            render={renderEndDate}
          />
        )}
        <Controller control={control} name="calendarId" render={renderCalendarId} />
        <TextArea {...register('description')} minRows={3} size={TEXT_INPUT_SIZE} placeholder="description" />
      </div>
      <div className={s.root__buttons}>
        <Button view="action" type="submit" size={BUTTON_SIZE} loading={isLoading} disabled={isLoading}>
          {event ? 'Save' : 'Create'}
        </Button>
        {event && (
          <DeleteDangerButton
            onDelete={handleDelete}
            title="Are you sure you want to delete this event?"
            buttonSize={BUTTON_SIZE}
          />
        )}
      </div>
    </form>
  );
};

export default memo(CalendarEventForm);
