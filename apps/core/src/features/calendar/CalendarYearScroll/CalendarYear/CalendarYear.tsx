import { Text } from '@gravity-ui/uikit';
import { CalendarYear as CalendarYearModel, CalendarMonth as CalendarMonthModel } from '@repo/models';
import { memo, useMemo } from 'react';

import CalendarMonth from './CalendarMonth';

import s from './CalendarYear.module.scss';

const monthModelCache = new Map<string, CalendarMonthModel>();
const MAX_MONTHS_CACHE_SIZE = 1200;

const getMonthModel = (monthId: string): CalendarMonthModel => {
  const existing = monthModelCache.get(monthId);

  if (existing) {
    return existing;
  }

  const model = new CalendarMonthModel(monthId);

  monthModelCache.set(monthId, model);

  if (monthModelCache.size > MAX_MONTHS_CACHE_SIZE) {
    const [oldestKey] = monthModelCache.keys();

    monthModelCache.delete(oldestKey);
  }

  return model;
};

const CalendarYear: React.FC<{ model: CalendarYearModel }> = ({ model }) => {
  const monthsModels = useMemo(() => model.getMonthsKeys().map(getMonthModel), [model]);

  return (
    <div className={s.root}>
      <Text className={s.root__header} variant="header-2" color="complementary">
        {model.id}
      </Text>
      <div className={s.root__grid}>
        {monthsModels.map((monthModel) => (
          <CalendarMonth key={monthModel.id} monthModel={monthModel} />
        ))}
      </div>
    </div>
  );
};

export default memo(CalendarYear, (prev, next) => prev.model.id === next.model.id);
