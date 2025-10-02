import { Text } from '@gravity-ui/uikit';
import { CalendarDay } from '@repo/models';
import { EventMode } from '@repo/types';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { Temporal } from 'temporal-polyfill';

import { useCalendarPageStore } from '@/stores';

import s from './Day.module.scss';

type Props = {
  dayId: string;
  isCurrentMonth?: boolean;
  onSelectDay: (date: Temporal.PlainDate) => void;
};

const Day: React.FC<Props> = ({ dayId, isCurrentMonth = false, onSelectDay }) => {
  const { calendar } = useCalendarPageStore();

  const nowDay = useMemo(() => new CalendarDay(calendar.navigation.nowDateId), [calendar.navigation.nowDateId]);
  const day = new CalendarDay(dayId);
  const isWeekend = day.date.dayOfWeek === 6 || day.date.dayOfWeek === 7;
  const isToday = isCurrentMonth && day.date.equals(nowDay.date);

  const isSelected = calendar.navigation.selectedDate.equals(day.date);

  const events = calendar.events.getEventsByPlainDate(EventMode.date, day.date);
  const allDayEvents = calendar.events.getEventsByPlainDate(EventMode.allDay, day.date);
  const hasEvents = events.length > 0 || allDayEvents.length > 0;

  const handleClick = useCallback(() => {
    onSelectDay(day.date);
  }, [day.date, onSelectDay]);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        s.root,
        isWeekend && s.root_weekend,
        isToday && s.root_today,
        isCurrentMonth && s['root_current-month'],
        isSelected && s.root_selected,
      )}
    >
      <Text variant="body-1" color={isCurrentMonth ? 'primary' : 'secondary'} className={s.root__value}>
        {day.date.day}
      </Text>
      {isCurrentMonth && hasEvents && <div className={s.root__events} />}
    </div>
  );
};

export default observer(Day);
