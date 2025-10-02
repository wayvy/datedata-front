import { ICalendarEvent } from '@repo/types';
import { CalendarEvent } from '@repo/ui';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import s from './CalendarDayEventsList.module.scss';

type Props = {
  className?: string;
  events: ICalendarEvent[];
  openEvent: (event: ICalendarEvent) => void;
  checkIsSelectedEvent: (event: ICalendarEvent) => boolean;
  getCalendarColor: (calendarId: string) => string;
};

const CalendarDayEventsList: React.FC<Props> = ({
  className,
  events,
  openEvent,
  checkIsSelectedEvent,
  getCalendarColor,
}) => {
  return (
    <div className={clsx(s.root, className)}>
      {events.map((event) => {
        return (
          <CalendarEvent
            key={event.id}
            event={event}
            openEvent={openEvent}
            isSelected={checkIsSelectedEvent(event)}
            getCalendarColor={getCalendarColor}
          />
        );
      })}
    </div>
  );
};

export default observer(CalendarDayEventsList);
