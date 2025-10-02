import { CalendarDay as CalendarDayModel } from '@repo/models';
import { FullPanelLoader } from '@repo/ui/components';
import { dayID } from '@repo/utils';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';

import CalendarDayEvents from '@/components/calendar/CalendarDayEvents';
import { useCalendarPageStore } from '@/stores';

import CalendarDayInfo from './CalendarDayInfo';
import CalendarDayNavigation from './CalendarDayNavigation';

import s from './CalendarDay.module.scss';

const CalendarDay: React.FC = () => {
  const { calendar } = useCalendarPageStore();

  const dayId = dayID(calendar.navigation.selectedDate.toPlainDate());

  const calendarDay = useMemo(() => {
    return new CalendarDayModel(dayId);
  }, [dayId]);

  return (
    <div className={s.root}>
      <CalendarDayInfo calendarDay={calendarDay} />
      {calendar.events.asyncState.isLoading ? <FullPanelLoader /> : <CalendarDayEvents calendarDay={calendarDay} />}
      <CalendarDayNavigation />
    </div>
  );
};

export default observer(CalendarDay);
