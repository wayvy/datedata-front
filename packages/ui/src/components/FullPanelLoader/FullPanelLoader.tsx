import { Loader, LoaderProps } from '@gravity-ui/uikit';
import { memo } from 'react';

import s from './FullPanelLoader.module.scss';

const FullPanelLoader: React.FC<LoaderProps> = (props) => {
  return (
    <div className={s.root}>
      <Loader size="l" {...props} />
    </div>
  );
};

export default memo(FullPanelLoader);
