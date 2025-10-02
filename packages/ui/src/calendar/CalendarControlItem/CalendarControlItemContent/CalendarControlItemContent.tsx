import { Text } from '@gravity-ui/uikit';
import { ICalendar } from '@repo/types';
import { memo } from 'react';

import s from './CalendarControlItemContent.module.scss';

type Props = {
  calendar: ICalendar;
};

const CalendarControlItemContent: React.FC<Props> = ({ calendar }) => {
  return (
    <div className={s.root}>
      <Text className={s.root__text}>{calendar.summary}</Text>
      <Text variant="caption-2" className={s.root__text}>
        {calendar.description}
      </Text>
    </div>
  );
};

export default memo(CalendarControlItemContent);
