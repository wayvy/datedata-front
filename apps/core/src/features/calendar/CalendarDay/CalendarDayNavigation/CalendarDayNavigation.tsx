import { ArrowLeft, ArrowRight } from '@gravity-ui/icons';
import { Button, Icon } from '@gravity-ui/uikit';
import { observer } from 'mobx-react-lite';

import { useCalendarPageStore } from '@/stores';

import s from './CalendarDayNavigation.module.scss';

const BUTTON_SIZE = 'l';
const ICON_SIZE = 14;

const CalendarDayNavigation: React.FC = () => {
  const {
    calendar: {
      navigation: { prevSelectedDate, nowSelectedDate, nextSelectedDate },
    },
  } = useCalendarPageStore();

  return (
    <div className={s.root}>
      <Button
        onClick={prevSelectedDate}
        view="raised"
        size={BUTTON_SIZE}
        pin="round-brick"
        style={{
          minWidth: 64,
        }}
      >
        <Icon data={ArrowLeft} size={ICON_SIZE} />
      </Button>
      <Button view="raised" size={BUTTON_SIZE} onClick={nowSelectedDate} pin="brick-brick">
        Today
      </Button>
      <Button
        onClick={nextSelectedDate}
        view="raised"
        size={BUTTON_SIZE}
        pin="brick-round"
        style={{
          minWidth: 64,
        }}
      >
        <Icon data={ArrowRight} size={ICON_SIZE} />
      </Button>
    </div>
  );
};

export default observer(CalendarDayNavigation);
