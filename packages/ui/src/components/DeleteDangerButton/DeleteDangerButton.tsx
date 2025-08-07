import { Button, ButtonSize, Sheet, Text } from '@gravity-ui/uikit';
import { memo } from 'react';

import { useDeleteDangerSheet } from './hooks/useDeleteDangerSheet';

import s from './DeleteDangerButton.module.scss';

type Props = {
  className?: string;
  onDelete: () => Promise<void>;
  buttonSize?: ButtonSize;
  title: string;
  subtitle?: string;
};

const DeleteDangerButton: React.FC<Props> = ({ className, onDelete, title, subtitle, buttonSize = 'm' }) => {
  const { isOpen, onClose, onOpen, isLoading, handleDelete } = useDeleteDangerSheet({
    onDelete,
  });

  return (
    <>
      <Button view="outlined-danger" size={buttonSize} onClick={onOpen} className={className}>
        Delete
      </Button>
      <Sheet visible={isOpen} onClose={onClose} contentClassName={s.root__content}>
        <div className={s.root__inner}>
          <div className={s.root__message}>
            <Text variant="subheader-2">{title}</Text>
            <Text variant="body-1">{subtitle}</Text>
          </div>
          <div className={s.root__buttons}>
            <Button
              view="outlined-danger"
              size={buttonSize}
              onClick={handleDelete}
              loading={isLoading}
              disabled={isLoading}
            >
              Delete
            </Button>
            <Button view="outlined" size={buttonSize} onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </Sheet>
    </>
  );
};

export default memo(DeleteDangerButton);
