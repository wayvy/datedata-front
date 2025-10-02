import { Text } from '@gravity-ui/uikit';
import { CalendarDay as CalendarDayModel } from '@repo/models';
import clsx from 'clsx';
import { memo, useMemo } from 'react';
import { Temporal } from 'temporal-polyfill';

import s from './CalendarDay.module.scss';

interface CalendarDayProps {
  model: CalendarDayModel;
  isCurrentMonth?: boolean;
  isMobile?: boolean;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ model, isCurrentMonth = false, isMobile = false }) => {
  const isWeekend = model.date.dayOfWeek === 6 || model.date.dayOfWeek === 7;
  const isToday = isCurrentMonth && model.date.equals(Temporal.Now.plainDateISO());

  const color = useMemo(() => {
    if (isMobile && isWeekend) {
      return 'primary';
    }

    if (!isMobile && !isCurrentMonth) {
      return 'secondary';
    }

    if (isWeekend) {
      return 'complementary';
    }

    return 'primary';
  }, [isCurrentMonth, isMobile, isWeekend]);

  return (
    <div
      className={clsx(
        s.root,
        isMobile && s.root_mobile,
        isToday && s.root_today,
        isCurrentMonth && s['root_current-month'],
      )}
    >
      <Text variant="caption-1" color={color}>
        <span className={s.root__value}>{model.date.day}</span>
      </Text>
    </div>
  );
};

export default memo(CalendarDay);
