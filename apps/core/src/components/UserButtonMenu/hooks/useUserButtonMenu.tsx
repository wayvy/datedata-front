import { useCallback, useState } from 'react';

import { useRootStore } from '@/stores';

export const useUserButtonMenu = () => {
  const { user, authService } = useRootStore();
  const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);
  const [userMenuVisible, setUserMenuVisible] = useState(false);

  const handleAccountMenuClick = useCallback(() => setUserMenuVisible((prev) => !prev), []);

  const handlePopupOnOpenChange = useCallback((open: boolean) => setUserMenuVisible(open), []);

  return {
    buttonRef,
    setButtonRef,
    userMenuVisible,
    handleAccountMenuClick,
    handlePopupOnOpenChange,
    handleLogoutClick: authService.logout,
    user,
    isRefreshingToken: authService.isRefreshingToken,
  };
};
