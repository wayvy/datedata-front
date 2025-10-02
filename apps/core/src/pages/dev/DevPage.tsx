import { memo } from 'react';

import styles from './DevPage.module.scss';

const DevPage: React.FC = () => {
  return <div className={styles.root}>Dev</div>;
};

export default memo(DevPage);
