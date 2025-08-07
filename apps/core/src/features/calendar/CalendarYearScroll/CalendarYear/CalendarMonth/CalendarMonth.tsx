import { Text } from '@gravity-ui/uikit';
import { CalendarDay as CalendarDayModel, CalendarMonth as CalendarMonthModel } from '@repo/models';
import { CalendarTab } from '@repo/types';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useCalendarPageStore, useRootStore } from '@/stores';

import CalendarDay from './CalendarDay';

import s from './CalendarMonth.module.scss';

const CalendarMonth: React.FC<{ monthModel: CalendarMonthModel }> = ({ monthModel }) => {
  const { isMobile } = useRootStore();
  const { calendar } = useCalendarPageStore();
  const nextMonthDays = useMemo(
    () => monthModel.getNextMonthDaysKeys().map((dayId) => new CalendarDayModel(dayId)),
    [monthModel],
  );
  const days = monthModel.getDaysKeys().map((dayId) => new CalendarDayModel(dayId));
  const prevMonthDays = useMemo(
    () => monthModel.getPrevMonthDaysKeys().map((dayId) => new CalendarDayModel(dayId)),
    [monthModel],
  );

  const handleClick = useCallback(() => {
    calendar.navigation.setCurrentTab(CalendarTab.month);
    calendar.navigation.setSelectedDate(monthModel.yearMonth.toPlainDate({ day: 1 }).toPlainDateTime());
  }, [calendar.navigation, monthModel.yearMonth]);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const current = ref.current;

    if (!current) {
      return;
    }

    current.addEventListener('mousedown', handleClick);

    return () => {
      current.removeEventListener('mousedown', handleClick);
    };
  }, [handleClick]);

  return (
    <div className={s.root} ref={ref}>
      <Text variant="body-1" color="primary">
        {monthModel.getMonthName()}
      </Text>
      {!isMobile && (
        <div className={s.root__days}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
            return (
              <Text key={day} className={clsx(s['root__day-name'])} variant="caption-1" color={'complementary'}>
                {day[0]}
              </Text>
            );
          })}
        </div>
      )}
      <div className={s.root__grid}>
        {prevMonthDays.map((day) => (
          <CalendarDay key={monthModel.id + '__' + day.id} model={day} isCurrentMonth={false} isMobile={isMobile} />
        ))}
        {days.map((day) => (
          <CalendarDay key={monthModel.id + '__' + day.id} model={day} isCurrentMonth isMobile={isMobile} />
        ))}
        {nextMonthDays.map((day) => (
          <CalendarDay key={monthModel.id + '__' + day.id} model={day} isCurrentMonth={false} isMobile={isMobile} />
        ))}
      </div>
    </div>
  );
};

export default observer(CalendarMonth);
