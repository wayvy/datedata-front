import { House, Calendar } from '@gravity-ui/icons';
import { MenuItemType } from '@gravity-ui/navigation';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { ROUTES } from '@/config/routes';

export const useMenuItems = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = useMemo(() => {
    return [
      {
        id: 'home',
        title: 'Home',
        icon: House,
        onItemClick: () => {
          navigate(ROUTES.home.path);
        },
        current: location.pathname.startsWith(ROUTES.home.path),
      },
      {
        id: 'divider-0',
        type: 'divider' as MenuItemType,
        title: 'Divider',
      },
      {
        id: 'calendar',
        title: 'Calendar',
        icon: Calendar,
        onItemClick: () => {
          navigate(ROUTES.calendar.path);
        },
        current: location.pathname.startsWith(ROUTES.calendar.path),
      },
      {
        id: 'divider-1',
        type: 'divider' as MenuItemType,
        title: 'Divider',
      },
    ];
  }, [location.pathname, navigate]);

  return {
    menuItems,
  };
};
