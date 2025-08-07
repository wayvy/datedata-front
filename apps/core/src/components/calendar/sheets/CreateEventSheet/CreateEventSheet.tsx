import { Sheet } from '@gravity-ui/uikit';
import { EventFormFieldValues } from '@repo/types/calendar';
import { CalendarEventForm } from '@repo/ui';
import { dateToNextNearestHalfHour, gravityDateToTemporal, temporalToGravityDate } from '@repo/utils';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';

import { useCalendarPageStore } from '@/stores';

import s from './CreateEventSheet.module.scss';

const CreateEventSheet: React.FC = () => {
  const { calendar } = useCalendarPageStore();
  const { calendarEntities, createEvent } = calendar;

  const selectedDateNowTime = useMemo(() => {
    const now = calendar.navigation.now;

    return calendar.navigation.selectedDate.with({ hour: now.hour, minute: now.minute, second: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createEvent.openState.isOpen]);

  const nearestStartDateTime = dateToNextNearestHalfHour(selectedDateNowTime);

  const startDate = temporalToGravityDate(selectedDateNowTime);
  const endDate = temporalToGravityDate(nearestStartDateTime.add({ hours: 1 }));

  const onSubmit = useCallback(
    async (data: EventFormFieldValues) => {
      await createEvent.fetchCreate({
        ...data,
        startDate: gravityDateToTemporal(data.startDate),
        endDate: gravityDateToTemporal(data.endDate),
      });
    },
    [createEvent],
  );

  const calendarId = calendarEntities.list[0]?.id;

  if (!calendarId) {
    return null;
  }

  return (
    <Sheet
      visible={createEvent.openState.isOpen}
      onClose={createEvent.openState.close}
      contentClassName={s.root__content}
      className={s.root}
      title="Create Event"
    >
      <CalendarEventForm
        defaultValues={{ startDate, endDate, calendarId }}
        calendars={calendarEntities.list}
        onSubmit={onSubmit}
        className={s.root__form}
        isLoading={createEvent.asyncState.isLoading}
      />
    </Sheet>
  );
};

export default observer(CreateEventSheet);
