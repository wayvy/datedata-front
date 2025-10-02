import { useLocalObservable } from 'mobx-react-lite';
import { useEffect } from 'react';

import { CalendarPageStore, CalendarPageStoreProvider, useRootStore } from '@/stores';
import { CalendarView } from '@/widgets/calendar';

const CalendarPage: React.FC = () => {
  const { authApi, changeVisibility } = useRootStore();
  const store = useLocalObservable(() => new CalendarPageStore({ api: authApi, changeVisibility }));

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

export default CalendarPage;
