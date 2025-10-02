import { Tab, TabList } from '@gravity-ui/uikit';
import { CalendarTab } from '@repo/types';

import CalendarsControlListSheet from '@/components/calendar/sheets/CalendarsControlListSheet';
import CreateEventSheet from '@/components/calendar/sheets/CreateEventSheet';
import EditEventSheet from '@/components/calendar/sheets/EditEventSheet';

import s from './CalendarNavigation.module.scss';

const CalendarNavigation: React.FC = () => {
  return (
    <div className={s.root}>
      <TabList size="l" className={s.root__tabs}>
        <Tab value={CalendarTab.day}>Day</Tab>
        <Tab value={CalendarTab.month}>Month</Tab>
        <Tab value={CalendarTab.year}>Year</Tab>
      </TabList>

      <CreateEventSheet />
      <EditEventSheet />
      <CalendarsControlListSheet />
    </div>
  );
};

export default CalendarNavigation;
