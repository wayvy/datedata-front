import { EyeSlash, Plus } from '@gravity-ui/icons';
import { Button, Icon } from '@gravity-ui/uikit';
import { observer } from 'mobx-react-lite';

import { useCalendarPageStore } from '@/stores';

import s from './CalendarControl.module.scss';

const BUTTON_SIZE = 'l';
const BUTTON_ICON_SIZE = 12;

const CalendarControl: React.FC = () => {
  const { calendar } = useCalendarPageStore();

  const isAllCalendarsDisabled = calendar.calendarEntities.visibleList.length === 0;

  return (
    <div className={s.root}>
      <div className={s.root__content}>
        <Button size={BUTTON_SIZE} onClick={calendar.calendarEntities.openState.open} className={s.root__calendars}>
          <span>Calendars</span>
          {isAllCalendarsDisabled && <Icon data={EyeSlash} size={BUTTON_ICON_SIZE} />}
        </Button>

        <Button size={BUTTON_SIZE} className={s.root__create} onClick={calendar.createEvent.openState.open}>
          <Icon data={Plus} size={BUTTON_ICON_SIZE} />
        </Button>
      </div>
    </div>
  );
};

export default observer(CalendarControl);
