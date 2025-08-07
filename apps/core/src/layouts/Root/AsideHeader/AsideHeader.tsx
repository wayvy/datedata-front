import { AsideHeader as GravityAsideHeader } from '@gravity-ui/navigation';

import { useLayout } from './hooks/useLayout';

import s from './AsideHeader.module.scss';

const AsideHeader: React.FC = () => {
  const { logo, compact, menuItems, onChangeCompact, renderContent, renderFooter } = useLayout();

  return (
    <GravityAsideHeader
      className={s.root}
      logo={logo}
      compact={compact}
      onChangeCompact={onChangeCompact}
      renderContent={renderContent}
      menuItems={menuItems}
      renderFooter={renderFooter}
      multipleTooltip
    />
  );
};

export default AsideHeader;
