import { monthID } from '@repo/utils/calendar';
import { observer } from 'mobx-react-lite';
import { useRef, useMemo, useCallback } from 'react';
import { Virtual, Mousewheel } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import { Temporal } from 'temporal-polyfill';

import 'swiper/css';
import 'swiper/css/virtual';

import Month from './Month';

const MONTHS_IN_YEAR = 12;
const TOTAL_SLIDES = 10000;
const INITIAL_INDEX = Math.floor(TOTAL_SLIDES / 2);

type Props = {
  className?: string;
  onSlideChange: ({ year, month }: { year: number; month: number }) => void;
};

const MonthSwiper: React.FC<Props> = ({ className, onSlideChange }) => {
  const swiperRef = useRef<any>(null);
  const baseDate = useMemo(() => new Date(), []);

  const getYearMonthByIndex = useCallback(
    (index: number) => {
      const diff = index - INITIAL_INDEX;
      const baseYear = baseDate.getFullYear();
      const baseMonth = baseDate.getMonth();

      const totalMonths = baseMonth + diff;
      const year = baseYear + Math.floor(totalMonths / MONTHS_IN_YEAR);
      const month = ((totalMonths % MONTHS_IN_YEAR) + MONTHS_IN_YEAR) % MONTHS_IN_YEAR;

      return { year, month };
    },
    [baseDate],
  );

  const handleSlideChange = useCallback(
    (swiper: SwiperType) => {
      const { year, month } = getYearMonthByIndex(swiper.activeIndex);

      onSlideChange({ year, month: month + 1 });
    },
    [getYearMonthByIndex, onSlideChange],
  );

  const renderSlide = (index: number) => {
    const { year, month } = getYearMonthByIndex(index);
    const temporalMonth = Temporal.PlainYearMonth.from({ year, month: month + 1 });

    return (
      <SwiperSlide key={index} virtualIndex={index}>
        <Month monthId={monthID(temporalMonth)} />
      </SwiperSlide>
    );
  };

  const onSwiper = useCallback((swiper: SwiperType) => {
    swiperRef.current = swiper;
  }, []);

  const slides = Array.from({ length: TOTAL_SLIDES }, (_, index) => renderSlide(index));

  return (
    <Swiper
      onSwiper={onSwiper}
      onSlideChange={handleSlideChange}
      className={className}
      initialSlide={INITIAL_INDEX}
      slidesPerView={1}
      spaceBetween={0}
      modules={[Virtual, Mousewheel]}
      virtual
      direction="vertical"
      mousewheel
    >
      {slides}
    </Swiper>
  );
};

export default observer(MonthSwiper);
