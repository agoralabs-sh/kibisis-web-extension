import { useSelector } from 'react-redux';

// Types
import { ILogger, IBaseRootState } from '../types';

export default function useSelectLogger(): ILogger {
  return useSelector<IBaseRootState, ILogger>(
    (state) => state.application.logger
  );
}
