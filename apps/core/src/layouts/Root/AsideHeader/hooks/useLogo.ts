import { useMemo } from 'react';
import { useNavigate } from 'react-router';

import { ROUTES } from '@/config/routes';

export const useLogo = () => {
  const navigate = useNavigate();

  const logo = useMemo(() => {
    return {
      text: 'DateData',
      iconSrc: 'logo.svg',
      onClick: () => {
        navigate(ROUTES.home.path);
      },
    };
  }, [navigate]);

  return {
    logo,
  };
};
