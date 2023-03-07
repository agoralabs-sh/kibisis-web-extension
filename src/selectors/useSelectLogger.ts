import { useSelector } from 'react-redux';

// Types
import { ILogger, IRootState } from '../types';

export default function useSelectLogger(): ILogger {
  return useSelector<IRootState, ILogger>((state) => state.application.logger);
}
