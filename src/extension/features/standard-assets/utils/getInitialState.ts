// types
import { IStandardAssetsState } from '../types';

export default function getInitialState(): IStandardAssetsState {
  return {
    fetching: false,
    items: null,
    saving: false,
    updating: false,
  };
}
