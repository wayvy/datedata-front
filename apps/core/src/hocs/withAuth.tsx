import { FullPanelLoader } from '@repo/ui';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { ROUTES } from '@/config/routes';
import { useRootStore } from '@/stores';

export const withAuth = <P extends Record<string, any>>(Component: React.ComponentType<P>) =>
  observer((props: P) => {
    const navigate = useNavigate();

    const {
      authService: {
        asyncState: { isLoading },
      },
      sessionStore: { isAuthenticated },
    } = useRootStore();

    useEffect(() => {
      if (isLoading) {
        return;
      }

      if (!isAuthenticated) {
        navigate(ROUTES.login.path, { replace: true });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, isLoading]);

    if (!isAuthenticated) {
      return <FullPanelLoader />;
    }

    return <Component {...props} />;
  });
