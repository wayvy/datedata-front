import { useCompact } from './useCompact';
import { useContent } from './useContent';
import { useFooter } from './useFooter';
import { useLogo } from './useLogo';
import { useMenuItems } from './useMenuItems';

export const useLayout = () => {
  const { compact, onChangeCompact } = useCompact();
  const { menuItems } = useMenuItems();
  const { renderFooter } = useFooter({ compact });
  const { renderContent } = useContent();
  const { logo } = useLogo();

  return {
    renderContent,
    renderFooter,
    onChangeCompact,
    menuItems,
    logo,
    compact,
  };
};
