import { Pencil } from '@gravity-ui/icons';
import { Button, Card, Checkbox, Icon, Spin } from '@gravity-ui/uikit';
import { ICalendar } from '@repo/types';
import clsx from 'clsx';
import { memo, useCallback, useMemo, useState } from 'react';

import CalendarControlItemContent from './CalendarControlItemContent/CalendarControlItemContent';

import s from './CalendarControlItem.module.scss';

type Props = {
  className?: string;
  calendar: ICalendar;
  checked: boolean;
  color: string;
  setChecked: (calendar: ICalendar, checked: boolean) => Promise<void>;
  onEdit: (calendar: ICalendar) => void;
};

const CalendarControlItem: React.FC<Props> = ({ className, calendar, checked, setChecked, color, onEdit }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = useCallback(
    async (checked: boolean) => {
      setIsLoading(true);
      await setChecked(calendar, checked);
      setIsLoading(false);
    },
    [calendar, setChecked],
  );

  const handleEdit = useCallback(() => {
    onEdit(calendar);
  }, [calendar, onEdit]);

  const content = useMemo(() => {
    return <CalendarControlItemContent calendar={calendar} />;
  }, [calendar]);

  return (
    <Card className={clsx(s.root, className)}>
      {isLoading ? (
        <div className={s.loader}>
          <div className={s.loader__inner}>
            <Spin size="xs" />
          </div>
          {content}
        </div>
      ) : (
        <Checkbox
          size="l"
          value={calendar.id}
          checked={checked}
          onUpdate={handleUpdate}
          className={s.root__checkbox}
          style={{
            '--calendar-checkbox-color': color,
          }}
        >
          {content}
        </Checkbox>
      )}

      <Button className={s.root__edit} size="m" onClick={handleEdit}>
        <Icon data={Pencil} />
      </Button>
    </Card>
  );
};

export default memo(CalendarControlItem);
