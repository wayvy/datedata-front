import { Text } from '@gravity-ui/uikit';
import { CalendarDay as CalendarDayModel, CalendarMonth as CalendarMonthModel } from '@repo/models';
import { EventMode, CalendarTab } from '@repo/types';
import { monthID } from '@repo/utils/calendar';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { Temporal } from 'temporal-polyfill';

import { useCalendarPageStore } from '@/stores';

import DayEvent from './DayEvent';

import s from './Day.module.scss';

const checkIsToday = (date: Temporal.PlainDate) => {
  const today = Temporal.Now.plainDateISO();

  return date.year === today.year && date.month === today.month && date.day === today.day;
};

const Day: React.FC<{ dayId: string }> = ({ dayId }) => {
  const { calendar } = useCalendarPageStore();

  const day = new CalendarDayModel(dayId);
  const month = new CalendarMonthModel(monthID(day.date.toPlainYearMonth()));

  const handleClick = useCallback(() => {
    calendar.navigation.setSelectedDate(day.date.toPlainDateTime());
    calendar.navigation.setCurrentTab(CalendarTab.day);
  }, [calendar.navigation, day.date]);

  const isSelected = useMemo(() => {
    return calendar.navigation.selectedDate.toPlainDate().equals(day.date);
  }, [calendar.navigation.selectedDate, day.date]);

  const isToday = useMemo(() => {
    return checkIsToday(day.date);
  }, [day.date]);

  return (
    <div
      key={dayId}
      className={clsx(s.root, isToday && s.root_today, isSelected && s.root_selected)}
      onClick={handleClick}
    >
      <div className={clsx(s.day, isToday && s.day_today)}>
        <Text
          variant="code-2"
          className={s.day__value}
          style={day.date.day === 1 ? { textDecoration: 'underline' } : {}}
        >
          {day.date.day === 1 && (
            <Text
              variant="code-1"
              style={{
                fontWeight: 600,
                textDecoration: 'underline',
              }}
            >
              {month.getMonthNameShort()}&nbsp;
            </Text>
          )}
          <Text variant="code-2">{day.date.day}</Text>
        </Text>
      </div>

      <div className={s['events-all-day']}>
        {calendar.events.list.getEventsByPlainDate(EventMode.allDay, day.date).map((event) => (
          <DayEvent key={event.id} day={day} event={event} getCalendarColor={calendar.calendarEntities.getColor} />
        ))}
      </div>

      <div className={s.events}>
        {calendar.events.list.getEventsByPlainDate(EventMode.date, day.date).map((event) => (
          <DayEvent key={event.id} day={day} event={event} getCalendarColor={calendar.calendarEntities.getColor} />
        ))}
      </div>
    </div>
  );
};

export default observer(Day);
