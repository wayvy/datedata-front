export const weekStart = () => {
  const locale = new Intl.Locale('ru');
  const weekInfo = (locale as { weekInfo?: { firstDay?: number } }).weekInfo;
  const weekStart = weekInfo?.firstDay ?? 1;

  return weekStart;
};
