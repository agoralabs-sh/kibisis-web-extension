// types
import type { IARC0200Asset } from '@extension/types';

interface IState {
  asset: IARC0200Asset | null;
  updating: boolean;
}

export default IState;
