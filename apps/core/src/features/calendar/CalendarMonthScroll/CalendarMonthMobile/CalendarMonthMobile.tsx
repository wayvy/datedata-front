import { Text } from '@gravity-ui/uikit';
import { CalendarDay, CalendarMonth } from '@repo/models/calendar';
import { dayID, monthID } from '@repo/utils/calendar';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { Temporal } from 'temporal-polyfill';

import CalendarDayEvents from '@/components/calendar/CalendarDayEvents';
import { useCalendarPageStore } from '@/stores';

import MonthSwiper from './MonthSwiper';

import s from './CalendarMonthMobile.module.scss';

const CalendarMonthMobile: React.FC = () => {
  const { calendar } = useCalendarPageStore();

  const dayId = dayID(calendar.navigation.selectedDate.toPlainDate());
  const calendarDay = new CalendarDay(dayId);

  const handleSetMonth = useCallback(
    ({ year, month }: { year: number; month: number }) => {
      const now = Temporal.Now.plainDateTimeISO();

      if (now.month === month && now.year === year) {
        calendar.navigation.setSelectedDate(now);

        return;
      }

      calendar.navigation.setSelectedDate(Temporal.PlainDateTime.from({ year, month: month, day: 1 }));
    },
    [calendar.navigation],
  );

  const month = new CalendarMonth(monthID(Temporal.PlainYearMonth.from(calendar.navigation.selectedDate)));

  return (
    <div className={s.root}>
      <div className={s.root__title}>
        <Text variant="header-2">{month.getMonthName()}</Text>
        &nbsp;
        <Text variant="header-2" color="complementary">
          {calendarDay.date.year}
        </Text>
      </div>
      <div className={s.root__header}>
        <div className={s.root__days}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <Text variant="caption-2" color="complementary" key={day} className={s.root__days__day}>
              {day}
            </Text>
          ))}
        </div>
      </div>

      <div className={s.root__container}>
        <MonthSwiper className={s.root__scroll} onSlideChange={handleSetMonth} />
      </div>
      <CalendarDayEvents calendarDay={calendarDay} />
    </div>
  );
};

export default observer(CalendarMonthMobile);
