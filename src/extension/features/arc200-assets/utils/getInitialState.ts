// types
import { IARC0200AssetsState } from '../types';

export default function getInitialState(): IARC0200AssetsState {
  return {
    fetching: false,
    items: null,
    saving: false,
    updating: false,
  };
}
