import { useCallback, useState } from 'react';

export const useCompact = () => {
  const [compact, setCompact] = useState(true);
  const onChangeCompact = useCallback((newCompact: boolean) => {
    setCompact(newCompact);
  }, []);

  return {
    compact,
    onChangeCompact,
  };
};
