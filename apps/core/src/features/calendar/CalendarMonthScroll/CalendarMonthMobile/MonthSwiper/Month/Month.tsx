import { CalendarMonth as CalendarMonthModel } from '@repo/models';
import { CalendarTab, MonthID } from '@repo/types';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { Temporal } from 'temporal-polyfill';

import { useCalendarPageStore } from '@/stores';

import Day from './Day';

import s from './Month.module.scss';

const Month = ({ monthId }: { monthId: MonthID }) => {
  const {
    calendar: {
      navigation: { setSelectedDate, selectedDate, setCurrentTab },
    },
  } = useCalendarPageStore();

  const month = useMemo(() => new CalendarMonthModel(monthId), [monthId]);
  const prevMonthDays = useMemo(() => month.getPrevMonthDaysKeys(), [month]);
  const days = useMemo(() => month.getDaysKeys(), [month]);
  const nextMonthDays = useMemo(() => month.getNextMonthDaysKeys(), [month]);

  const handleSelectDay = useCallback(
    (date: Temporal.PlainDate) => {
      if (selectedDate.equals(date)) {
        setCurrentTab(CalendarTab.day);
      } else {
        setSelectedDate(date.toPlainDateTime());
      }
    },
    [selectedDate, setCurrentTab, setSelectedDate],
  );

  return (
    <div className={s.root}>
      <div className={s.root__grid}>
        {prevMonthDays.map((dayId) => {
          return <Day key={dayId} dayId={dayId} onSelectDay={handleSelectDay} />;
        })}
        {days.map((dayId) => {
          return <Day key={dayId} dayId={dayId} isCurrentMonth onSelectDay={handleSelectDay} />;
        })}
        {nextMonthDays.map((dayId) => {
          return <Day key={dayId} dayId={dayId} onSelectDay={handleSelectDay} />;
        })}
      </div>
    </div>
  );
};

export default observer(Month);
