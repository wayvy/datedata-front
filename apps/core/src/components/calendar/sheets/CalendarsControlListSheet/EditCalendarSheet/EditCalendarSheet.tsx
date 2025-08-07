import { Sheet } from '@gravity-ui/uikit';
import { CalendarForm } from '@repo/ui';
import { observer } from 'mobx-react-lite';

import { useCalendarPageStore } from '@/stores';

import s from './EditCalendarSheet.module.scss';

const EditCalendarSheet: React.FC = () => {
  const {
    calendar: {
      editCalendar: { calendar, openState, asyncState, fetchSave, fetchDelete },
    },
  } = useCalendarPageStore();

  if (!calendar) {
    return null;
  }

  return (
    <Sheet
      visible={openState.isOpen}
      onClose={openState.close}
      title="Edit Calendar"
      className={s.root}
      contentClassName={s.root__content}
    >
      <CalendarForm
        className={s.root__form}
        isOpen={openState.isOpen}
        calendar={calendar}
        onSubmit={fetchSave}
        onDelete={fetchDelete}
        isLoading={asyncState.isLoading}
      />
    </Sheet>
  );
};

export default observer(EditCalendarSheet);
