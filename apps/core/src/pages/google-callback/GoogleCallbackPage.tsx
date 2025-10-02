import { FullPanelLoader } from '@repo/ui';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { ROUTES } from '@/config/routes';
import { useRootStore } from '@/stores';

import s from './GoogleCallbackPage.module.scss';

const GoogleCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { authService } = useRootStore();

  const handleGoogleCallback = async () => {
    try {
      await authService.handleGoogleCallback();
      navigate(ROUTES.home.path);
    } catch (error) {
      // TODO: handle error
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  useEffect(() => {
    handleGoogleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={s.root}>
      <FullPanelLoader />
    </div>
  );
};

export default GoogleCallbackPage;
