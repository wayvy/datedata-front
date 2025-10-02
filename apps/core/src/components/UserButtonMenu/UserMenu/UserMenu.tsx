import { Button, Menu } from '@gravity-ui/uikit';
import { memo } from 'react';

import s from './UserMenu.module.scss';

type Props = {
  handleLogoutClick: () => void;
};

const UserMenu: React.FC<Props> = ({ handleLogoutClick }) => {
  return (
    <Menu size="l" className={s.root}>
      <Menu.Group>
        <Menu.Item>
          <Button size="m" width="max" view="outlined-danger" onClick={handleLogoutClick}>
            Logout
          </Button>
        </Menu.Item>
      </Menu.Group>
    </Menu>
  );
};

export default memo(UserMenu);
