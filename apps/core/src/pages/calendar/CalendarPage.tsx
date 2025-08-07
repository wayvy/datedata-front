import { useLocalObservable } from 'mobx-react-lite';
import { useEffect } from 'react';

import { CalendarPageStore, CalendarPageStoreProvider, useRootStore } from '@/stores';
import { CalendarView } from '@/widgets/calendar';

const CalendarSettingsPage: React.FC = () => {
  const { authApi } = useRootStore();
  const store = useLocalObservable(() => new CalendarPageStore({ api: authApi }));

  useEffect(() => {
    store.init();

    return () => {
      store.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CalendarPageStoreProvider store={store}>
      <CalendarView />
    </CalendarPageStoreProvider>
  );
};

export default CalendarSettingsPage;
