import { TabPanel, TabProvider } from '@gravity-ui/uikit';
import { CalendarTab } from '@repo/types';
import { FullPanelLoader } from '@repo/ui/components/FullPanelLoader';
import { observer } from 'mobx-react-lite';

import CalendarControl from '@/components/calendar/CalendarControl';
import CalendarDay from '@/features/calendar/CalendarDay';
import CalendarMonthScroll from '@/features/calendar/CalendarMonthScroll';
import CalendarNavigation from '@/features/calendar/CalendarNavigation';
import CalendarYearScroll from '@/features/calendar/CalendarYearScroll';
import { useCalendarPageStore, useRootStore } from '@/stores';

import s from './CalendarView.module.scss';

const CalendarView: React.FC = () => {
  const { isMobile } = useRootStore();
  const {
    calendar: { navigation, asyncState },
  } = useCalendarPageStore();

  if (asyncState.isLoading) {
    return <FullPanelLoader />;
  }

  return (
    <TabProvider value={navigation.currentTab} onUpdate={navigation.setCurrentTab}>
      <CalendarNavigation />
      <div className={s.root}>
        <TabPanel value={CalendarTab.day} className={s.root__panel}>
          <CalendarDay />
        </TabPanel>

        <TabPanel value={CalendarTab.month} className={s.root__panel}>
          <CalendarMonthScroll isMobile={isMobile} />
        </TabPanel>

        <TabPanel value={CalendarTab.year} className={s.root__panel}>
          <CalendarYearScroll />
        </TabPanel>
      </div>

      <CalendarControl />
    </TabProvider>
  );
};

export default observer(CalendarView);
