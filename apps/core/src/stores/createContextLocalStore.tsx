import type { IDestroyable } from '@repo/types';
import * as React from 'react';

export const createContextLocalStore = <T extends IDestroyable>(Constructor: new (...args: any[]) => T) => {
  const Context = React.createContext<T | null>(null);

  const Provider = ({ children, store }: React.PropsWithChildren<{ store: T }>) => (
    <Context.Provider value={store}>{children}</Context.Provider>
  );

  const useStore = () => {
    const context = React.useContext(Context);

    if (!context) {
      throw new Error(`${Constructor.name} not in Provider`);
    }

    return context;
  };

  return {
    Provider,
    useStore,
  };
};
