import { Avatar, Button, Loader } from '@gravity-ui/uikit';
import { IUser } from '@repo/types';

import s from './UserButton.module.scss';

type Props = {
  compact: boolean;
  setButtonRef: (ref: HTMLButtonElement | null) => void;
  handleAccountMenuClick: () => void;
  user: IUser;
  isRefreshingToken: boolean;
};

const UserButton: React.FC<Props> = ({ compact, setButtonRef, handleAccountMenuClick, user, isRefreshingToken }) => {
  return (
    <Button
      ref={setButtonRef}
      onClick={handleAccountMenuClick}
      size="xl"
      pin={compact ? 'clear-clear' : 'circle-circle'}
      className={s.root}
    >
      <div className={s.root__content}>
        {isRefreshingToken ? <Loader size="s" /> : <Avatar imgUrl={user.avatar} loading="eager" />}
        <div>{compact ? null : user.name}</div>
      </div>
    </Button>
  );
};

export default UserButton;
