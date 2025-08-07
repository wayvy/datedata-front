import { ICalendarWeek } from '@repo/types';
import clsx from 'clsx';
import { memo } from 'react';

import Day from './Day';

import s from './Week.module.scss';

type Props = {
  className?: string;
  week: ICalendarWeek;
};

const Week: React.FC<Props> = ({ className, week }) => {
  const daysIds = week.getDaysIds();

  return (
    <div className={clsx(s.root, className)}>
      {daysIds.map((dayId) => {
        return <Day key={dayId} dayId={dayId} />;
      })}
    </div>
  );
};

export default memo(Week);
