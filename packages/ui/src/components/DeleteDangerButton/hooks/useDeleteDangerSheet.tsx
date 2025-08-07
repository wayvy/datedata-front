import { useCallback } from 'react';
import { useState } from 'react';

export const useDeleteDangerSheet = ({ onDelete }: { onDelete: () => Promise<void> }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const onOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleDelete = useCallback(async () => {
    setIsLoading(true);
    await onDelete();
    setIsLoading(false);
    onClose();
  }, [onDelete, onClose]);

  return {
    isOpen,
    isLoading,
    onOpen,
    onClose,
    handleDelete,
  };
};
