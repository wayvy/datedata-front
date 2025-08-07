import { Lang } from '@gravity-ui/uikit';

export const getBrowserLang = () => {
  const lang = navigator.language;

  if (lang in Lang) {
    return lang;
  }

  return 'en';
};
