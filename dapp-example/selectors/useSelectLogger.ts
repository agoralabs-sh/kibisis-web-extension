import { useContext } from 'react';

// contexts
import SystemContext from '../contexts/SystemContext';

// types
import type { ILogger } from '@common/types';

export default function useSelectLogger(): ILogger {
  const { logger } = useContext(SystemContext);

  return logger;
}
