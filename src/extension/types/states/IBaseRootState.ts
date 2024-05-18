// features
import type { IARC0200AssetsState } from '@extension/features/arc0200-assets';
import type { ISystemState } from '@extension/features/system';

interface IBaseRootState {
  arc0200Assets: IARC0200AssetsState;
  system: ISystemState;
}

export default IBaseRootState;
