import { createContextLocalStore } from '@/stores/createContextLocalStore';

import { CalendarPageStore } from './CalendarPageStore';

const { Provider, useStore } = createContextLocalStore(CalendarPageStore);

export { Provider as CalendarPageStoreProvider, useStore as useCalendarPageStore, CalendarPageStore };
