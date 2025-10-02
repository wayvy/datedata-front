import { Button } from '@gravity-ui/uikit';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { ROUTES } from '@/config/routes';
import { useRootStore } from '@/stores';

import s from './LoginPage.module.scss';

const LoginPage: React.FC = () => {
  const {
    authService,
    sessionStore: { isAuthenticated },
  } = useRootStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = useCallback(async () => {
    try {
      setLoading(true);
      const authUrl = await authService.getGoogleAuthUrl();

      window.location.href = authUrl;
    } catch (error) {
      // TODO: handle error
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, [authService]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.home.path);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <div className={s.root}>
      <Button onClick={handleGoogleLogin} loading={loading} size="l">
        Login with Google
      </Button>
    </div>
  );
};

export default observer(LoginPage);
