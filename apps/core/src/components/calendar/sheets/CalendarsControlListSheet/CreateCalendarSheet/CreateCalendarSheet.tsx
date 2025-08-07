import { Sheet } from '@gravity-ui/uikit';
import { CalendarForm } from '@repo/ui';
import { observer } from 'mobx-react-lite';

import { useCalendarPageStore } from '@/stores';

import s from './CreateCalendarSheet.module.scss';

const CreateCalendarSheet: React.FC = () => {
  const {
    calendar: {
      createCalendar: { openState, asyncState, fetchCreate },
    },
  } = useCalendarPageStore();

  return (
    <Sheet
      visible={openState.isOpen}
      onClose={openState.close}
      title="Create Calendar"
      className={s.root}
      contentClassName={s.root__content}
    >
      <CalendarForm
        isOpen={openState.isOpen}
        onSubmit={fetchCreate}
        isLoading={asyncState.isLoading}
        className={s.root__form}
      />
    </Sheet>
  );
};

export default observer(CreateCalendarSheet);
