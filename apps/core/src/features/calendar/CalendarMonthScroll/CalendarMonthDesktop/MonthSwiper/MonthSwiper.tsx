import { CalendarWeek as CalendarWeekModel } from '@repo/models';
import { weekID } from '@repo/utils';
import { autorun } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useRef, useMemo, useCallback, useEffect } from 'react';
import { Virtual, Mousewheel } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import { Temporal } from 'temporal-polyfill';

import 'swiper/css';
import 'swiper/css/virtual';

import { useCalendarPageStore } from '@/stores';

import Week from './Week';

import s from './MonthSwiper.module.scss';

const TOTAL_SLIDES = 500;
const INITIAL_INDEX = Math.floor(TOTAL_SLIDES / 2);

const getMonthStart = (date: Temporal.PlainDate) => {
  const firstDayOfMonth = new Temporal.PlainDate(date.year, date.month, 1);
  const dayOfWeek = firstDayOfMonth.dayOfWeek;
  const firstDateOfWeek = firstDayOfMonth.subtract({ days: dayOfWeek - 1 });

  return firstDateOfWeek;
};

const MonthSwiper: React.FC = () => {
  const { calendar } = useCalendarPageStore();

  const swiperRef = useRef<any>(null);
  const baseDate = useMemo(() => getMonthStart(Temporal.Now.plainDateISO()), []);

  const getWeekData = (slideIndex: number) => {
    const offsetDays = (slideIndex - INITIAL_INDEX) * 7;
    const currentDate = baseDate.add({ days: offsetDays });

    return weekID(currentDate);
  };

  const renderSlide = (index: number) => {
    const weekId = getWeekData(index);

    const week = new CalendarWeekModel(weekId);

    return (
      <SwiperSlide key={index} virtualIndex={index}>
        <Week week={week} />
      </SwiperSlide>
    );
  };

  const onSwiper = useCallback((swiper: SwiperType) => {
    swiperRef.current = swiper;
  }, []);

  const slides = Array.from({ length: TOTAL_SLIDES }, (_, index) => renderSlide(index));

  const goToDate = useCallback(
    (targetDate: Temporal.PlainDateTime) => {
      const date = targetDate.toPlainDate();
      const daysDiff = date.since(baseDate).days;
      const weeksDiff = Math.floor(daysDiff / 7);
      const targetIndex = INITIAL_INDEX + weeksDiff;

      swiperRef.current?.slideTo(targetIndex);
    },
    [baseDate],
  );

  useEffect(() => {
    const dispose = autorun(() => {
      goToDate(calendar.navigation.selectedDate);
    });

    return () => dispose();
  }, [calendar.navigation.selectedDate, goToDate]);

  useEffect(() => {
    return () => swiperRef.current?.destroy(true, true);
  }, []);

  return (
    <Swiper
      onSwiper={onSwiper}
      className={s.root}
      initialSlide={INITIAL_INDEX}
      slidesPerView={6}
      spaceBetween={0}
      modules={[Virtual, Mousewheel]}
      virtual
      direction="vertical"
      mousewheel
      freeMode={{
        enabled: true,
        sticky: true,
        momentum: true,
      }}
    >
      {slides}
    </Swiper>
  );
};

export default observer(MonthSwiper);
