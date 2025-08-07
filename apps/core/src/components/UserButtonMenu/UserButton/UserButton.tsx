import { Avatar, Button } from '@gravity-ui/uikit';
import { IUser } from '@repo/types';

import s from './UserButton.module.scss';

type Props = {
  compact: boolean;
  setButtonRef: (ref: HTMLButtonElement | null) => void;
  handleAccountMenuClick: () => void;
  user: IUser;
};

const UserButton: React.FC<Props> = ({ compact, setButtonRef, handleAccountMenuClick, user }) => {
  return (
    <Button
      ref={setButtonRef}
      onClick={handleAccountMenuClick}
      size="xl"
      pin={compact ? 'clear-clear' : 'circle-circle'}
      className={s.root}
    >
      <div className={s.root__content}>
        <Avatar imgUrl={user.avatar} loading="eager" />
        <div>{compact ? null : user.name}</div>
      </div>
    </Button>
  );
};

export default UserButton;
