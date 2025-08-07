import { SelectOption } from '@gravity-ui/uikit';
import { ICalendar } from '@repo/types';
import clsx from 'clsx';
import { memo } from 'react';

import s from './CalendarSelectOption.module.scss';

type Props = {
  className?: string;
  option: SelectOption<ICalendar>;
};

const CalendarSelectOption: React.FC<Props> = ({ className, option }) => {
  return (
    <div className={clsx(s.root, className)}>
      <div
        className={s.root__color}
        style={{
          background: option.data?.color || 'transparent',
        }}
      />
      <span>{option.content}</span>
    </div>
  );
};

export default memo(CalendarSelectOption);
