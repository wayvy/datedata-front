import { Card, Text } from '@gravity-ui/uikit';
import { ICalendarEvent } from '@repo/types';
import { leadingZero } from '@repo/utils';
import clsx from 'clsx';
import { memo, useCallback } from 'react';

import s from './CalendarEvent.module.scss';

type Props = {
  className?: string;
  event: ICalendarEvent;
  getCalendarColor: (calendarId: string) => string;
  openEvent: (event: ICalendarEvent) => void;
  isSelected: boolean;
};

const CalendarEvent: React.FC<Props> = ({ className, event, getCalendarColor, openEvent, isSelected }) => {
  const color = getCalendarColor(event.calendarId);

  const handleClick = useCallback(() => {
    openEvent(event);
  }, [openEvent, event]);

  return (
    <Card
      type="action"
      key={event.id}
      onClick={handleClick}
      className={clsx(s.root, isSelected && s.root_selected, className)}
      style={{ backgroundColor: color }}
    >
      <div className={s.root__content}>
        {!event.allDay && (
          <div>
            <Text
              variant="code-2"
              style={{
                fontWeight: 600,
              }}
            >
              <span>
                {leadingZero(event.start.hour)}:{leadingZero(event.start.minute)}
              </span>
              <span>
                &nbsp;–&nbsp;{leadingZero(event.end.hour)}:{leadingZero(event.end.minute)}
              </span>
            </Text>
          </div>
        )}

        <Text
          variant="code-1"
          style={{
            fontWeight: 600,
          }}
          className={s.root__text_overflow}
        >
          {event.title}
        </Text>
      </div>
    </Card>
  );
};

export default memo(CalendarEvent);
