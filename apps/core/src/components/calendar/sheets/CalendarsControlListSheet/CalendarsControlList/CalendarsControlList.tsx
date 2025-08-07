import { ICalendar } from '@repo/types/calendar';
import { CalendarControlItem } from '@repo/ui';
import { memo, useCallback } from 'react';

import s from './CalendarsControlList.module.scss';

type Props = {
  calendars: ICalendar[];
  setChecked: (calendar: ICalendar, checked: boolean) => Promise<void>;
  onEdit: (calendar: ICalendar) => void;
};

const CalendarsControlList: React.FC<Props> = ({ calendars, setChecked, onEdit }) => {
  const handleEdit = useCallback(
    (calendar: ICalendar) => {
      onEdit(calendar);
    },
    [onEdit],
  );

  return (
    <div className={s.root}>
      {calendars.map((entity) => {
        return (
          <CalendarControlItem
            key={entity.id}
            calendar={entity}
            checked={entity.checked}
            setChecked={setChecked}
            color={entity.color}
            onEdit={handleEdit}
          />
        );
      })}
    </div>
  );
};

export default memo(CalendarsControlList);
