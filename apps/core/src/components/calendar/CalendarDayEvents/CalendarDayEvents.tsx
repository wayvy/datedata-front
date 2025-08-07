import { Text } from '@gravity-ui/uikit';
import { EventMode, ICalendarDay, ICalendarEvent } from '@repo/types';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';

import { useCalendarPageStore } from '@/stores';

import CalendarDayEventsList from './CalendarDayEventsList';

import s from './CalendarDayEvents.module.scss';

type Props = {
  calendarDay: ICalendarDay;
};

const CalendarDayEvents: React.FC<Props> = ({ calendarDay }) => {
  const { calendar } = useCalendarPageStore();

  const allDayEvents = calendar.events.list.getEventsByPlainDate(EventMode.allDay, calendarDay.date);
  const dateEvents = calendar.events.list.getEventsByPlainDate(EventMode.date, calendarDay.date);

  const openEvent = useCallback(
    (event: ICalendarEvent) => {
      calendar.navigation.setSelectedEvent(event);
      calendar.editEvent.open(event);
    },
    [calendar.editEvent, calendar.navigation],
  );

  const checkIsSelectedEvent = useCallback(
    (event: ICalendarEvent) => {
      return calendar.navigation.selectedEvent?.id === event.id;
    },
    [calendar.navigation.selectedEvent],
  );

  if (allDayEvents.length === 0 && dateEvents.length === 0) {
    return (
      <div className={s.root}>
        <Text variant="header-1" color="secondary" className={s.root__text}>
          No events
        </Text>
      </div>
    );
  }

  const eventsListProps = {
    openEvent,
    checkIsSelectedEvent,
    getCalendarColor: calendar.calendarEntities.getColor,
  };

  return (
    <div className={s.root}>
      <CalendarDayEventsList events={allDayEvents} className={s['root__list_all-day']} {...eventsListProps} />
      {allDayEvents.length > 0 && <div className={s.root__separator} />}
      <CalendarDayEventsList events={dateEvents} {...eventsListProps} />
    </div>
  );
};

export default observer(CalendarDayEvents);
