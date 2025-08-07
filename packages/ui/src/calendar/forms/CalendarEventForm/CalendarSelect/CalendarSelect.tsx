import { Select, SelectOption, SelectProps } from '@gravity-ui/uikit';
import { ICalendar, EventFormFieldValues } from '@repo/types';
import { memo, useCallback } from 'react';
import { ControllerRenderProps } from 'react-hook-form';

import CalendarSelectOption from './CalendarSelectOption';

type Props = SelectProps<ICalendar> & {
  className?: string;
  optionClassName?: string;
  field: ControllerRenderProps<EventFormFieldValues, 'calendarId'>;
  onUpdate: (value: string[]) => void;
  options: SelectOption<ICalendar>[];
};

const CalendarSelect: React.FC<Props> = ({ className, optionClassName, field, onUpdate, options, ...props }) => {
  const renderOption = useCallback(
    (option: SelectOption<ICalendar>) => {
      return <CalendarSelectOption option={option} className={optionClassName} />;
    },
    [optionClassName],
  );

  return (
    <Select
      {...props}
      renderSelectedOption={renderOption}
      popupPlacement="top-start"
      value={[field.value]}
      onUpdate={onUpdate}
      options={options}
      renderOption={renderOption}
      className={className}
    />
  );
};

export default memo(CalendarSelect);
