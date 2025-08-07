import { configure } from '@gravity-ui/uikit';
import { ThemeProvider } from '@gravity-ui/uikit';
import { ToasterComponent, ToasterProvider } from '@gravity-ui/uikit';
import { appToaster, checkIsMobile, debounce, getBrowserLang } from '@repo/utils';
import { useLocalObservable } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';

import { RootStore, RootStoreProvider } from '@/stores';

import AsideHeader from './AsideHeader';

configure({
  lang: getBrowserLang(),
});

const Root: React.FC = () => {
  const store = useLocalObservable(() => new RootStore());

  useEffect(() => {
    return () => {
      store.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResize = useMemo(() => {
    return debounce(() => {
      const isMobile = checkIsMobile();

      store.setIsMobile(isMobile);
    }, 100);
  }, [store]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return (
    <ThemeProvider theme="dark">
      <ToasterProvider toaster={appToaster}>
        <RootStoreProvider store={store}>
          <AsideHeader />
          <ToasterComponent />
        </RootStoreProvider>
      </ToasterProvider>
    </ThemeProvider>
  );
};

export default Root;
