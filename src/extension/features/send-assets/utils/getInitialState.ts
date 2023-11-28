// types
import { ISendAssetsState } from '../types';

export default function getInitialState(): ISendAssetsState {
  return {
    selectedAsset: null,
  };
}
