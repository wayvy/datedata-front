import { Popup } from '@gravity-ui/uikit';
import { observer } from 'mobx-react-lite';

import { UserButton } from './UserButton';
import { UserMenu } from './UserMenu';
import { useUserButtonMenu } from './hooks/useUserButtonMenu';

import s from './UserButtonMenu.module.scss';

type Props = {
  compact: boolean;
};

const UserButtonMenu: React.FC<Props> = ({ compact }) => {
  const {
    buttonRef,
    setButtonRef,
    userMenuVisible,
    handleAccountMenuClick,
    handlePopupOnOpenChange,
    handleLogoutClick,
    user,
    isRefreshingToken,
  } = useUserButtonMenu();

  if (!user) {
    return null;
  }

  return (
    <div className={s.root}>
      <UserButton
        compact={compact}
        setButtonRef={setButtonRef}
        handleAccountMenuClick={handleAccountMenuClick}
        user={user}
        isRefreshingToken={isRefreshingToken}
      />
      <Popup
        modal
        anchorElement={buttonRef}
        open={userMenuVisible}
        placement="top"
        onOpenChange={handlePopupOnOpenChange}
      >
        <UserMenu handleLogoutClick={handleLogoutClick} />
      </Popup>
    </div>
  );
};

export default observer(UserButtonMenu);
