import { FullPanelLoader } from '@repo/ui';
import { Suspense } from 'react';
import { Outlet } from 'react-router';

import Header from '@/components/Header';

import s from './AsideHeaderContent.module.scss';

const AsideHeaderContent: React.FC = () => {
  return (
    <div className={s.root}>
      <Header />
      <div className={s.root__outlet}>
        <Suspense fallback={<FullPanelLoader />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default AsideHeaderContent;
