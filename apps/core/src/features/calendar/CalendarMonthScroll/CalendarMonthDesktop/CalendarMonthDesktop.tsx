import { Text } from '@gravity-ui/uikit';

import MonthSwiper from './MonthSwiper';

import s from './CalendarMonthDesktop.module.scss';

const CalendarMonthDesktop: React.FC = () => {
  return (
    <div className={s.root}>
      <div className={s.root__header}>
        <div className={s.root__days}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <Text variant="subheader-1" key={day} className={s.root__day}>
              {day}
            </Text>
          ))}
        </div>
      </div>
      <div className={s.root__container}>
        <MonthSwiper />
      </div>
    </div>
  );
};

export default CalendarMonthDesktop;
