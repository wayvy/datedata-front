import { memo } from 'react';

import CalendarMonthDesktop from './CalendarMonthDesktop';
import CalendarMonthMobile from './CalendarMonthMobile';

type Props = {
  isMobile: boolean;
};

const CalendarMonthScroll: React.FC<Props> = ({ isMobile }) => {
  if (isMobile) {
    return <CalendarMonthMobile />;
  }

  return <CalendarMonthDesktop />;
};

export default memo(CalendarMonthScroll);
