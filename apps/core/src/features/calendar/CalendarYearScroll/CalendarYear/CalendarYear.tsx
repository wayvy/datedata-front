import { Text } from '@gravity-ui/uikit';
import { CalendarYear as CalendarYearModel, CalendarMonth as CalendarMonthModel } from '@repo/models';
import { ICalendarYear, YearID } from '@repo/types';
import { memo } from 'react';

import CalendarMonth from './CalendarMonth';

import s from './CalendarYear.module.scss';

const MAX_CACHE_SIZE = 100;
const modelCache = new Map<string, ICalendarYear>();

const getYearModel = (yearId: string): CalendarYearModel => {
  const existing = modelCache.get(yearId);

  if (existing) {
    modelCache.set(yearId, existing);

    return existing;
  }

  const model = new CalendarYearModel(yearId);

  modelCache.set(yearId, model);

  if (modelCache.size > MAX_CACHE_SIZE) {
    const [oldestKey] = modelCache.keys();

    modelCache.delete(oldestKey);
  }

  return model;
};

const CalendarYear: React.FC<{ yearId: YearID }> = ({ yearId }) => {
  const model = getYearModel(yearId);
  const monthsModels = model.getMonthsKeys().map((monthId) => new CalendarMonthModel(monthId));

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

export default memo(CalendarYear);
