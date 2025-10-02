import { FooterItem } from '@gravity-ui/navigation';
import { useCallback } from 'react';

import { UserButtonMenu } from '@/components/UserButtonMenu';

type Props = {
  compact: boolean;
};

export const useFooter = ({ compact }: Props) => {
  const itemWrapper = useCallback(() => <UserButtonMenu compact={compact} />, [compact]);

  const renderFooter = useCallback(() => {
    return (
      <FooterItem
        compact={compact}
        item={{
          id: 'user-button',
          title: null,
          itemWrapper,
          type: 'action',
          pinned: true,
        }}
      />
    );
  }, [compact, itemWrapper]);

  return {
    renderFooter,
  };
};
