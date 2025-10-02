import { createContextLocalStore } from '@/stores/createContextLocalStore';

import { RootStore } from './RootStore';

const { Provider, useStore } = createContextLocalStore(RootStore);

export { Provider as RootStoreProvider, useStore as useRootStore, RootStore };
