import { useSelector } from 'react-redux';

// types
import type { ICustomNodeItem } from '@extension/services/CustomNodesService';
import type { IMainRootState } from '@extension/types';

export default function useSelectCustomNodesItems(): ICustomNodeItem[] {
  return useSelector<IMainRootState, ICustomNodeItem[]>(
    (state) => state.customNodes.items
  );
}
