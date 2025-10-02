import { Text } from '@gravity-ui/uikit';
import { CalendarMonth } from '@repo/models';
import { ICalendarDay } from '@repo/types/calendar';
import { leadingZero, monthID } from '@repo/utils';
import { memo } from 'react';
import { Temporal } from 'temporal-polyfill';

import s from './CalendarDayInfo.module.scss';

type Props = {
  calendarDay: ICalendarDay;
};

const CalendarDayInfo: React.FC<Props> = ({ calendarDay }) => {
  return (
    <div className={s.root}>
      <Text variant="header-2">
        <span>{leadingZero(calendarDay.date.day)}</span>
        &nbsp;
        {/** TODO: build month name */}
        <span>{new CalendarMonth(monthID(Temporal.PlainYearMonth.from(calendarDay.date))).getMonthName()}</span>
        &nbsp;
        <Text variant="header-2" color="complementary">
          {calendarDay.date.year}
        </Text>
      </Text>
      <Text variant="subheader-2" color="secondary">
        {calendarDay.getDayOfWeekName()}
      </Text>
    </div>
  );
};

export default memo(CalendarDayInfo);
