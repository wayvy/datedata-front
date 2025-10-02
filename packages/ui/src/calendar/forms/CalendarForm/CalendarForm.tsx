import { Button, TextInput } from '@gravity-ui/uikit';
import { CalendarFormFieldValues } from '@repo/types';
import clsx from 'clsx';
import { memo, useCallback } from 'react';
import { Controller, ControllerRenderProps } from 'react-hook-form';

import { DeleteDangerButton } from '../../../components';
import { ColorPalette } from '../../ColorPalette';

import { useCalendarForm } from './hooks/useCalendarForm';
import { CalendarFormProps } from './types';

import s from './CalendarForm.module.scss';

const TEXT_INPUT_SIZE = 'm';
const BUTTON_SIZE = TEXT_INPUT_SIZE;

const CalendarForm: React.FC<CalendarFormProps> = ({ className, isOpen, isLoading, onSubmit, calendar, onDelete }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useCalendarForm({ calendar, isOpen });

  const submit = useCallback(
    async (data: CalendarFormFieldValues) => {
      if (!calendar) {
        return onSubmit(data);
      }

      return onSubmit(data, calendar);
    },
    [onSubmit, calendar],
  );

  const handleDelete = useCallback(async () => {
    if (!calendar || !onDelete) {
      return;
    }

    await onDelete(calendar);
  }, [calendar, onDelete]);

  const renderColorField = useCallback(
    ({ field }: { field: ControllerRenderProps<CalendarFormFieldValues, 'color'> }) => (
      <ColorPalette value={field.value} onChange={field.onChange} />
    ),
    [],
  );

  return (
    <form onSubmit={handleSubmit(submit)} className={clsx(s.root, className)}>
      <TextInput
        {...register('summary', { required: 'Summary is required' })}
        error={errors.summary?.message}
        autoComplete={false}
        size={TEXT_INPUT_SIZE}
        label="summary"
        autoFocus
      />
      <TextInput {...register('description')} autoComplete={false} size={TEXT_INPUT_SIZE} label="description" />
      <Controller control={control} name="color" render={renderColorField} />
      <Button
        size={BUTTON_SIZE}
        type="submit"
        width="max"
        className={s.root__submit}
        disabled={isLoading}
        loading={isLoading}
        view="action"
      >
        {calendar ? 'Save' : 'Create'}
      </Button>
      {calendar && onDelete && (
        <DeleteDangerButton
          onDelete={handleDelete}
          title="Are you sure you want to delete this calendar?"
          subtitle="This action will delete all events from this calendar."
          buttonSize={BUTTON_SIZE}
        />
      )}
    </form>
  );
};

export default memo(CalendarForm);
