import { Text } from '@gravity-ui/uikit';
import { CalendarDay } from '@repo/models/calendar';
import { ICalendarEvent } from '@repo/types';
import { memo } from 'react';

import s from './DayEvent.module.scss';

type Props = {
  day: CalendarDay;
  event: ICalendarEvent;
  getCalendarColor: (calendarId: string) => string;
};

const DayEvent: React.FC<Props> = ({ event, getCalendarColor }) => {
  return (
    <div
      className={s.root}
      style={{
        backgroundColor: getCalendarColor(event.calendarId),
      }}
    >
      <Text variant="caption-2" className={s.root__title}>
        {event.title}
      </Text>
    </div>
  );
};

export default memo(DayEvent);
