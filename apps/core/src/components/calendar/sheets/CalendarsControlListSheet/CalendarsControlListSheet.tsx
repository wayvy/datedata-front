import { Button, Sheet } from '@gravity-ui/uikit';
import { FullPanelLoader } from '@repo/ui/components';
import { observer } from 'mobx-react-lite';

import { useCalendarPageStore } from '@/stores';

import CalendarsControlList from './CalendarsControlList';
import CreateCalendarSheet from './CreateCalendarSheet';
import EditCalendarSheet from './EditCalendarSheet';

import s from './CalendarsControlListSheet.module.scss';

const CalendarsControlListSheet: React.FC = () => {
  const {
    calendar: { calendarEntities, createCalendar, editCalendar, setCheckedCalendar },
  } = useCalendarPageStore();

  return (
    <Sheet
      title="Calendars"
      visible={calendarEntities.openState.isOpen}
      onClose={calendarEntities.openState.close}
      allowHideOnContentScroll={false}
      className={s.root}
      contentClassName={s.root__content}
    >
      <div className={s.root__inner}>
        {createCalendar.asyncState.isLoading ? (
          <FullPanelLoader />
        ) : (
          <CalendarsControlList
            calendars={calendarEntities.list}
            setChecked={setCheckedCalendar}
            onEdit={editCalendar.open}
          />
        )}
        <div className={s.root__controls}>
          <Button size="l" onClick={createCalendar.openState.open} width="max">
            Add Calendar
          </Button>
        </div>

        <CreateCalendarSheet />
        <EditCalendarSheet />
      </div>
    </Sheet>
  );
};

export default observer(CalendarsControlListSheet);
