import { createContext } from 'react';

// types
import type { IState } from './types';

// utils
import createLogger from '@common/utils/createLogger';

const Context = createContext<IState>({
  logger: createLogger('debug'),
});

export default Context;
