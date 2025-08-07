import { Sheet } from '@gravity-ui/uikit';
import { EventFormFieldValues } from '@repo/types/calendar';
import { CalendarEventForm } from '@repo/ui';
import { gravityDateToTemporal, temporalToGravityDate } from '@repo/utils';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';

import { useCalendarPageStore } from '@/stores';

import s from './EditEventSheet.module.scss';

const EditEventSheet: React.FC = () => {
  const {
    calendar: {
      editEvent: { event, fetchEdit, fetchDelete, asyncState, openState },
      calendarEntities,
      navigation,
    },
  } = useCalendarPageStore();

  const onSubmit = useCallback(
    (data: EventFormFieldValues) => {
      if (!event) {
        return;
      }

      fetchEdit({
        id: event.id,
        title: data.title,
        description: data.description,
        startDate: gravityDateToTemporal(data.startDate),
        endDate: gravityDateToTemporal(data.endDate),
        calendarId: data.calendarId,
        allDay: data.allDay,
      });
    },
    [event, fetchEdit],
  );

  const handleClose = useCallback(() => {
    openState.close();
    navigation.setSelectedEvent(null);
  }, [openState, navigation]);

  if (!event) {
    return null;
  }

  return (
    <Sheet
      title="Edit Event"
      visible={openState.isOpen}
      onClose={handleClose}
      contentClassName={s.root__content}
      className={s.root}
    >
      <CalendarEventForm
        className={s.root__form}
        deleteDangerClassName={s['root__delete-danger']}
        defaultValues={{
          ...event,
          startDate: temporalToGravityDate(event.start),
          endDate: temporalToGravityDate(event.end),
          calendarId: event.calendarId,
        }}
        onSubmit={onSubmit}
        calendars={calendarEntities.list}
        event={event}
        onDelete={fetchDelete}
        isLoading={asyncState.isLoading}
      />
    </Sheet>
  );
};

export default observer(EditEventSheet);
