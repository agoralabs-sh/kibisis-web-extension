// Types
import { IAssetsState } from '../types';

export default function getInitialState(): IAssetsState {
  return {
    fetching: false,
    items: null,
    saving: false,
    updating: false,
  };
}
