import { useCallback } from 'react';

import AsideHeaderContent from '../AsideHeaderContent';

export const useContent = () => {
  const renderContent = useCallback(() => <AsideHeaderContent />, []);

  return {
    renderContent,
  };
};
