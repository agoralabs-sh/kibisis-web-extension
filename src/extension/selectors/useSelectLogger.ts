import { useSelector } from 'react-redux';

// Types
import { ILogger } from '@common/types';
import { IBaseRootState } from '@extension/types';

export default function useSelectLogger(): ILogger {
  return useSelector<IBaseRootState, ILogger>((state) => state.system.logger);
}
